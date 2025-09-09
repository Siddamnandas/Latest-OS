# Prompt Engineering Best Practices for Agentic Coding Tools

**Based on Grok-code-fast-1 Guidelines**
*Optimized for efficient development with agentic AI tools*

## Overview

This document outlines best practices for crafting effective prompts when working with AI-powered coding tools like Grok-code-fast-1. These guidelines ensure precise, focused, and productive interactions for development tasks.

## Core Principles

### 1. Provide Necessary Context
Be specific about the context to focus the AI's attention and prevent unnecessary deviations.

**Anti-pattern (vague):**
```
Make error handling better
```

**Good pattern (specific):**
```
My error codes are defined in @errors.ts, can you use that as reference to add proper error handling and error codes to @sql.ts where I am making queries
```

**Key tips:**
- Include relevant file paths, project structures, or dependencies
- Avoid providing irrelevant context that could confuse the AI
- Use file references (e.g., `@filename.ts`) to specify context

### 2. Set Explicit Goals and Requirements
Clearly define what you want to accomplish and why.

**Anti-pattern (underspecified):**
```
Create a food tracker
```

**Good pattern (detailed):**
```
Create a food tracker which shows the breakdown of calorie consumption per day divided by different nutrients when I enter a food item. Make it such that I can see an overview as well as get high level trends.
```

**Key tips:**
- State specific requirements and constraints
- Define success criteria
- Include UI/UX requirements for web projects

### 3. Continuously Refine Your Prompts
Take advantage of the AI's speed and low cost to iterate rapidly.

**Refinement example:**
```
The previous approach didn't consider the IO heavy process which can block the main thread, we might want to run it in its own threadloop such that it does not block the event loop instead of just using the async lib version
```

**Key tips:**
- Learn from initial implementation attempts
- Add more context based on feedback
- Refine based on specific failures or limitations

### 4. Assign Agentic Tasks
Use the AI for iterative, collaborative coding rather than one-off queries.

**Choose agentic approach for:**
- Complex feature implementations
- Code modifications across multiple files
- Architecture decisions
- Debugging complex issues
- Refactoring existing codebases

**When to use one-shot queries:**
- Simple questions
- Quick code snippets
- Documentation lookups

## Advanced Techniques for API Integration

### Reasoning and Tool Calling
- Leverage native tool calling capabilities instead of XML-based approaches
- Use streaming mode to access reasoning content via `chunk.choices[0].delta.reasoning_content`

### System Prompt Best Practices
- Provide detailed system prompts with clear expectations
- Include edge cases the AI should consider
- Define the AI's role and constraints

### Context Management
- Use XML tags or Markdown formatting to organize context sections
- Provide descriptive headings for different context areas
- Include examples and templates for consistency

### Performance Optimization
- Maintain consistent prompt formats to maximize cache hits
- Avoid changing prompt history unnecessarily
- Use concise, focused context to reduce token usage

## Project-Specific Application

In the Latest-OS project:
- Always reference relevant files in `src/`, `prisma/`, or `public/` directories
- Include API endpoints from `src/app/api/` when working with server-side logic
- Reference database schemas from `prisma/schema.prisma` for data-related tasks
- Consider mobile-specific requirements from `mobile-app/` directory

## Common Patterns

### Code Review Tasks
```
Review @component.ts for security vulnerabilities, focusing on input validation and data sanitization. Suggest improvements with code examples.
```

### Feature Implementation
```
Implement user authentication flow in @auth.ts. Requirements:
- JWT token management
- Password hashing with bcrypt
- Role-based access control
- Error handling for invalid credentials
```

### Database Operations
```
Add CRUD operations for entity in @model.ts and @api.ts. Include:
- Input validation using @validation.ts
- Proper error codes from @errors.ts
- Transaction safety for complex operations
```

## Measuring Success

- Prompt clarity reduces back-and-forth iterations
- Specific context leads to more accurate implementations
- Detailed requirements minimize assumptions and errors
- Iterative refinement improves final solution quality

## Getting Started

1. Identify your specific coding task or problem
2. Gather relevant context (files, dependencies, existing code)
3. Write a clear, detailed prompt following these patterns
4. Execute iteratively, refining as needed

## Resources

- Based on Grok-code-fast-1 optimization guide
- Compatible with agentic coding tool workflows
- Designed for rapid prototyping and development acceleration
