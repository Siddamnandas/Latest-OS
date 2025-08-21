'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Heart, 
  Filter, 
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Star,
  Clock
} from 'lucide-react';

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
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MemoryTimelineProps {
  memories: Memory[];
  onMemoryClick?: (memory: Memory) => void;
}

export function MemoryTimeline({ memories, onMemoryClick }: MemoryTimelineProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'audio' | 'video' | 'image'>('all');
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'sentiment'>('date');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'calendar'>('timeline');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Group memories by year and month
  const groupedMemories = useMemo(() => {
    let filtered = memories.filter(memory => {
      const matchesSearch = !searchTerm || 
        memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memory.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === 'all' || memory.type === filterType;
      const matchesSentiment = filterSentiment === 'all' || memory.sentiment === filterSentiment;
      const matchesYear = new Date(memory.date).getFullYear() === selectedYear;
      
      return matchesSearch && matchesType && matchesSentiment && matchesYear;
    });

    // Sort memories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'sentiment':
          return a.sentiment.localeCompare(b.sentiment);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    // Group by year and month
    const grouped = filtered.reduce((acc, memory) => {
      const date = new Date(memory.date);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });
      
      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][month]) {
        acc[year][month] = [];
      }
      
      acc[year][month].push(memory);
      return acc;
    }, {} as Record<number, Record<string, Memory[]>>);

    return grouped;
  }, [memories, searchTerm, filterType, filterSentiment, sortBy, selectedYear]);

  const availableYears = useMemo(() => {
    const years = new Set(memories.map(memory => new Date(memory.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [memories]);

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'audio': return '🎵';
      case 'video': return '🎬';
      case 'image': return '📷';
      default: return '📝';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700 border-green-200';
      case 'negative': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  if (viewMode === 'timeline') {
    return (
      <div className="space-y-6">
        {/* Header and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Memory Timeline</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedYear(prev => {
                    const currentIndex = availableYears.indexOf(prev);
                    const nextIndex = currentIndex < availableYears.length - 1 ? currentIndex + 1 : 0;
                    return availableYears[nextIndex];
                  })}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedYear(prev => {
                    const currentIndex = availableYears.indexOf(prev);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableYears.length - 1;
                    return availableYears[prevIndex];
                  })}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search memories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterSentiment} onValueChange={(value: any) => setFilterSentiment(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="sentiment">Sentiment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Content */}
        <ScrollArea className="h-[600px]">
          {Object.keys(groupedMemories).length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No memories found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {Object.entries(groupedMemories).map(([year, months]) => (
                <div key={year} className="relative">
                  {/* Year header */}
                  <div className="flex items-center mb-6">
                    <div className="w-4 h-4 bg-purple-600 rounded-full relative z-10 mr-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900">{year}</h2>
                  </div>
                  
                  {Object.entries(months).map(([month, monthMemories]) => (
                    <div key={month} className="mb-8">
                      {/* Month header */}
                      <div className="flex items-center mb-4">
                        <div className="w-3 h-3 bg-purple-400 rounded-full relative z-10 mr-4"></div>
                        <h3 className="text-lg font-semibold text-gray-700">{month}</h3>
                        <Badge variant="secondary" className="ml-3">
                          {monthMemories.length} memories
                        </Badge>
                      </div>
                      
                      {/* Memory cards */}
                      <div className="ml-12 space-y-4">
                        {monthMemories.map((memory, index) => (
                          <motion.div
                            key={memory.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                          >
                            {/* Timeline dot */}
                            <div className="absolute -left-16 top-6 w-2 h-2 bg-purple-400 rounded-full"></div>
                            
                            <Card 
                              className="hover:shadow-lg transition-all cursor-pointer"
                              onClick={() => onMemoryClick?.(memory)}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">{getMemoryIcon(memory.type)}</span>
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{memory.title}</h4>
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        {new Date(memory.date).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Badge className={getSentimentColor(memory.sentiment)}>
                                      {getSentimentEmoji(memory.sentiment)} {memory.sentiment}
                                    </Badge>
                                    {memory.isPrivate && (
                                      <Badge variant="outline">Private</Badge>
                                    )}
                                  </div>
                                </div>
                                
                                {memory.description && (
                                  <p className="text-gray-700 mb-3 line-clamp-2">
                                    {memory.description}
                                  </p>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-wrap gap-1">
                                    {memory.tags.slice(0, 3).map(tag => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        #{tag}
                                      </Badge>
                                    ))}
                                    {memory.tags.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{memory.tags.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    {memory.partners.length > 0 && (
                                      <>
                                        <Users className="w-4 h-4" />
                                        <span>{memory.partners.length}</span>
                                      </>
                                    )}
                                    {memory.location && (
                                      <>
                                        <MapPin className="w-4 h-4" />
                                        <span>{memory.location}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }

  // Grid view placeholder
  if (viewMode === 'grid') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Grid view coming soon!</p>
      </div>
    );
  }

  // Calendar view placeholder
  if (viewMode === 'calendar') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Calendar view coming soon!</p>
      </div>
    );
  }

  return null;
}