import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

async function createIssue(message: string, screenshot?: string) {
  const repo = process.env.FEEDBACK_GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  if (!repo || !token) {
    logger.info('Feedback:', message, screenshot ? '(screenshot included)' : '');
    return;
  }
  const [owner, repoName] = repo.split('/');
  const body = {
    title: `User Feedback`,
    body: `${message}${screenshot ? `\n\n![screenshot](${screenshot})` : ''}`,
  };
  await fetch(`https://api.github.com/repos/${owner}/${repoName}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify(body),
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const message = String(formData.get('message') || '');
    const file = formData.get('screenshot') as Blob | null;
    let screenshotBase64: string | undefined;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      screenshotBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    }
    await createIssue(message, screenshotBase64);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ message: 'Feedback endpoint' });
}
