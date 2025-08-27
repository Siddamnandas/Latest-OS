'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Heart, 
  Plus, 
  Play, 
  Pause, 
  Music, 
  Camera, 
  Mic, 
  FileText, 
  Calendar,
  Search,
  Filter,
  Download,
  Share2,
  Trash2,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MemoryRecorder } from './MemoryRecorder';

interface Memory {
  id: string;
  type: 'text' | 'audio' | 'video' | 'image';
  content: string;
  title: string;
  description?: string;
  date: Date;
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  partners: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MemoryJukeboxProps {
  coupleId: string;
}

export function MemoryJukebox({ coupleId }: MemoryJukeboxProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showMemoryRecorder, setShowMemoryRecorder] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    description: '',
    type: 'text' as 'text' | 'audio' | 'video' | 'image',
    content: '',
    tags: [] as string[],
    isPrivate: false
  });
  const { toast } = useToast();

  // Fetch memories from API
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (coupleId) {
          params.append('couple_id', coupleId);
        }
        
        const response = await fetch(`/api/memories?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch memories');
        }
        
        const result = await response.json();
        if (result.success) {
          setMemories(result.data);
          setFilteredMemories(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch memories');
        }
      } catch (error) {
        console.error('Error fetching memories:', error);
        toast({
          title: "Error Loading Memories",
          description: error instanceof Error ? error.message : 'Failed to load memories',
          variant: "destructive",
        });
        // Use fallback mock data on error
        const mockMemories: Memory[] = [
          {
            id: '1',
            type: 'text',
            content: 'Today we celebrated our 5th anniversary with a romantic dinner. The food was amazing and we talked about our favorite memories together.',
            title: '5th Anniversary Celebration',
            description: 'Romantic dinner at our favorite restaurant',
            date: new Date('2024-01-15'),
            tags: ['anniversary', 'romance', 'celebration'],
            sentiment: 'positive',
            partners: ['partner_a', 'partner_b'],
            isPrivate: false,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
          }
        ];
        setMemories(mockMemories);
        setFilteredMemories(mockMemories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemories();
  }, [coupleId, toast]);

  // Filter memories based on search and tags
  useEffect(() => {
    let filtered = memories;

    if (searchTerm) {
      filtered = filtered.filter(memory =>
        memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memory.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(memory =>
        selectedTags.every(tag => memory.tags.includes(tag))
      );
    }

    setFilteredMemories(filtered);
  }, [memories, searchTerm, selectedTags]);

  const allTags = Array.from(new Set(memories.flatMap(memory => memory.tags)));

  const handleAddMemory = () => {
    if (!newMemory.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please add a title for your memory",
        variant: "destructive",
      });
      return;
    }

    // This is now just for the simple add dialog
    // For full functionality, we'll use the MemoryRecorder component
    const memory: Memory = {
      id: Date.now().toString(),
      ...newMemory,
      date: new Date(),
      sentiment: 'positive', // Default sentiment
      partners: ['partner_a'], // Current user
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setMemories(prev => [memory, ...prev]);
    setNewMemory({
      title: '',
      description: '',
      type: 'text',
      content: '',
      tags: [],
      isPrivate: false
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Memory Added! 🎉",
      description: "Your memory has been saved successfully",
      duration: 3000,
    });
  };

  const handleMemorySuccess = (newMemory: any) => {
    // Add the new memory to the list
    setMemories(prev => [newMemory, ...prev]);
    setShowMemoryRecorder(false);
  };

  const handlePlayMemory = (memoryId: string) => {
    if (isPlaying === memoryId) {
      setIsPlaying(null);
    } else {
      setIsPlaying(memoryId);
      // Simulate playing audio/video
      setTimeout(() => setIsPlaying(null), 3000);
    }
  };

  const handleDeleteMemory = (memoryId: string) => {
    setMemories(prev => prev.filter(memory => memory.id !== memoryId));
    toast({
      title: "Memory Deleted",
      description: "The memory has been removed",
      duration: 2000,
    });
  };

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'audio': return Mic;
      case 'video': return Play;
      case 'image': return Camera;
      default: return FileText;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700';
      case 'negative': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (showMemoryRecorder) {
    return (
      <MemoryRecorder
        coupleId={coupleId}
        onSuccess={handleMemorySuccess}
        onCancel={() => setShowMemoryRecorder(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Memory Jukebox</h2>
          <p className="text-gray-600">Preserve and replay your precious moments</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowMemoryRecorder(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Memory
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Memory</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Memory title"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Describe this memory..."
                  value={newMemory.description}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, description: e.target.value }))}
                />
                <div className="flex gap-2">
                  {(['text', 'audio', 'video', 'image'] as const).map(type => (
                    <Button
                      key={type}
                      variant={newMemory.type === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewMemory(prev => ({ ...prev, type }))}
                    >
                      {type === 'text' && <FileText className="w-4 h-4" />}
                      {type === 'audio' && <Mic className="w-4 h-4" />}
                      {type === 'video' && <Play className="w-4 h-4" />}
                      {type === 'image' && <Camera className="w-4 h-4" />}
                    </Button>
                  ))}
                </div>
                <Button onClick={handleAddMemory} className="w-full">
                  Save Memory
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2 mt-3">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedTags(prev => 
                  prev.includes(tag) 
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                )}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Memory Timeline */}
      {isLoading ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading memories...</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {filteredMemories.map((memory, index) => {
              const Icon = getMemoryIcon(memory.type);
              return (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Icon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{memory.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {new Date(memory.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSentimentColor(memory.sentiment)}>
                            {memory.sentiment}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayMemory(memory.id)}
                          >
                            {isPlaying === memory.id ? 
                              <Pause className="w-4 h-4" /> : 
                              <Play className="w-4 h-4" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMemory(memory.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {memory.description && (
                        <p className="text-gray-700 mb-4">{memory.description}</p>
                      )}

                      {/* Memory Content Preview */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        {memory.type === 'text' && (
                          <p className="text-gray-700">{memory.content}</p>
                        )}
                        {memory.type === 'audio' && (
                          <div className="flex items-center gap-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <Music className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                        {memory.type === 'image' && (
                          <div className="w-full h-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-600" />
                          </div>
                        )}
                        {memory.type === 'video' && (
                          <div className="w-full h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg flex items-center justify-center">
                            <Play className="w-8 h-8 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {memory.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      )}

      {/* Empty State */}
      {!isLoading && filteredMemories.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No memories yet</h3>
            <p className="text-gray-500 mb-4">Start creating beautiful memories together</p>
            <Button onClick={() => setShowMemoryRecorder(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Memory
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}