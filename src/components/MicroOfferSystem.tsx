'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Heart,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Gift,
  Star,
  Coffee,
  Utensils,
  Moon,
  Sun,
  Home,
  Car,
  Phone,
  MessageCircle,
  Calendar,
  Zap,
  Trophy,
  Timer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface MicroOffer {
  id: string;
  fromUser: string;
  toUser: string;
  title: string;
  description: string;
  category: 'romance' | 'daily-life' | 'surprise' | 'care' | 'future-commitment';
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  coinReward: number;
  estimatedTime: number;
  icon?: string;
  createdAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  priority: 'low' | 'medium' | 'high';
  isRecurring: boolean;
}

const offerTemplates = {
  romance: [
    { title: 'Breakfast in bed', description: 'Wake up to a lovingly prepared breakfast', icon: '☕', reward: 30, time: 15 },
    { title: 'Love note surprise', description: 'Leave a sweet note for them to find', icon: '💌', reward: 20, time: 5 },
    { title: 'Dance session', description: 'Dance together to our favorite song', icon: '💃', reward: 25, time: 10 },
    { title: 'Foot massage', description: 'Give a relaxing foot massage', icon: '🦶', reward: 35, time: 20 },
    { title: 'Stargazing night', description: 'Watch the stars together', icon: '⭐', reward: 40, time: 30 }
  ],
  'daily-life': [
    { title: 'Make coffee/tea', description: 'Prepare their favorite hot beverage', icon: '☕', reward: 15, time: 5 },
    { title: 'Laundry help', description: 'Help with washing or folding laundry', icon: '🧺', reward: 25, time: 20 },
    { title: 'Grocery run', description: 'Pick up groceries for the week', icon: '🛒', reward: 35, time: 30 },
    { title: 'Dish cleanup', description: 'Wash dishes after dinner', icon: '🍽️', reward: 20, time: 15 },
    { title: 'Morning alarm', description: 'Wake them gently with breakfast', icon: '⏰', reward: 25, time: 10 }
  ],
  surprise: [
    { title: 'Secret lunch delivery', description: 'Surprise them with lunch at work', icon: '🍱', reward: 45, time: 20 },
    { title: 'Favorite snack', description: 'Get their favorite treat', icon: '🍪', reward: 20, time: 10 },
    { title: 'Homecoming surprise', description: 'Prepare a welcome home surprise', icon: '🏠', reward: 35, time: 15 },
    { title: 'Memory reminder', description: 'Remind them of a special memory we share', icon: '💭', reward: 15, time: 5 },
    { title: 'Random hug attack', description: 'Give unexpected hugs throughout the day', icon: '🤗', reward: 30, time: 20 }
  ],
  care: [
    { title: 'Temperature check', description: 'Ask how they\'re feeling and listen', icon: '🌡️', reward: 15, time: 10 },
    { title: 'Shoulder massage', description: 'Help release built-up tension', icon: '💆', reward: 35, time: 20 },
    { title: 'Listen without advice', description: 'Be fully present and listen', icon: '👂', reward: 25, time: 30 },
    { title: 'Favorite playlist', description: 'Create a playlist of songs they love', icon: '🎵', reward: 30, time: 15 },
    { title: 'Home organization', description: 'Tidy up a space they care about', icon: '🧹', reward: 40, time: 45 }
  ],
  'future-commitment': [
    { title: 'Weekend getaway', description: 'Plan a special weekend together', icon: '🏖️', reward: 50, time: 60 },
    { title: 'Monthly date night', description: 'Organize our monthly special outing', icon: '📅', reward: 45, time: 30 },
    { title: 'Photo session', description: 'Plan a private photoshoot together', icon: '📸', reward: 40, time: 30 },
    { title: 'Cooking class', description: 'Sign up for a couples cooking class', icon: '👩‍🍳', reward: 50, time: 60 },
    { title: 'Relationship book', description: 'Read and discuss a relationship book', icon: '📖', reward: 35, time: 45 }
  ]
};

export function MicroOfferSystem({ partnerInfo = { name: "Priya", isOnline: true } }) {
  const { toast } = useToast();
  const [offers, setOffers] = useState<MicroOffer[]>([
    {
      id: '1',
      fromUser: 'Arjun',
      toUser: 'Priya',
      title: 'Morning Coffee Ritual',
      description: 'Prepare and serve coffee just the way you like it, with a hug and good morning kiss',
      category: 'daily-life',
      status: 'completed',
      coinReward: 25,
      estimatedTime: 5,
      icon: '☕',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: 'medium',
      isRecurring: false
    },
    {
      id: '2',
      fromUser: 'Priya',
      toUser: 'Arjun',
      title: 'Evening Wind-down',
      description: 'Help you relax with a gentle back massage and tea before bed',
      category: 'care',
      status: 'accepted',
      coinReward: 35,
      estimatedTime: 20,
      icon: '🌙',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      priority: 'high',
      isRecurring: false
    },
    {
      id: '3',
      fromUser: 'Arjun',
      toUser: 'Priya',
      title: 'Movie & Cuddles Night',
      description: 'Watch a romantic movie with cuddles and your favorite treat',
      category: 'romance',
      status: 'pending',
      coinReward: 40,
      estimatedTime: 120,
      icon: '🎥',
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
      priority: 'medium',
      isRecurring: false
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof offerTemplates>('romance');
  const [quickOffer, setQuickOffer] = useState({
    title: '',
    description: '',
    category: 'romance',
    estimatedTime: 15,
    coinReward: 25
  });

  const getCategoryIcon = (category: string) => {
    const icons = {
      romance: <Heart className="w-4 h-4 text-pink-500" />,
      'daily-life': <Home className="w-4 h-4 text-blue-500" />,
      surprise: <Gift className="w-4 h-4 text-purple-500" />,
      care: <Star className="w-4 h-4 text-green-500" />,
      'future-commitment': <Calendar className="w-4 h-4 text-orange-500" />
    };
    return icons[category as keyof typeof icons] || <Zap className="w-4 h-4 text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'accepted':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Send className="w-4 h-4" />;
      case 'declined':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Timer className="w-4 h-4" />;
    }
  };

  const acceptOffer = (offerId: string) => {
    setOffers(prev => prev.map(offer =>
      offer.id === offerId
        ? { ...offer, status: 'accepted' as const }
        : offer
    ));

    toast({
      title: "🙏 Offer Accepted!",
      description: "Thank you for accepting this loving gesture",
    });

    // Notify gamification system
    document.dispatchEvent(new CustomEvent('gamification:action', {
      detail: { action: 'nudged_accepted', context: 'micro-offer' }
    }));
  };

  const declineOffer = (offerId: string) => {
    setOffers(prev => prev.map(offer =>
      offer.id === offerId
        ? { ...offer, status: 'declined' as const }
        : offer
    ));

    toast({
      title: "Offer Declined",
      description: "Maybe another time - love you! 💕",
    });
  };

  const completeOffer = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    setOffers(prev => prev.map(o =>
      o.id === offerId ? {
        ...o,
        status: 'completed' as const,
        completedAt: new Date()
      } : o
    ));

    toast({
      title: `🎉 Offer Completed! +${offer.coinReward} coins`,
      description: `Thank you for this amazing act of love: "${offer.title}"`,
    });

    // Notify gamification system - this is a meaningful relationship action
    document.dispatchEvent(new CustomEvent('gamification:action', {
      detail: {
        action: 'activity_completed',
        context: {
          type: 'micro-offer',
          currency: 'coins',
          value: offer.coinReward,
          category: offer.category
        }
      }
    }));
  };

  const createCustomOffer = () => {
    if (!quickOffer.title || !quickOffer.description) {
      toast({
        title: "Please fill in all fields",
        description: "Add a title and description for your offer",
        variant: "destructive"
      });
      return;
    }

    const newOffer: MicroOffer = {
      id: Date.now().toString(),
      fromUser: 'Arjun',
      toUser: 'Priya',
      title: quickOffer.title,
      description: quickOffer.description,
      category: quickOffer.category as any,
      status: 'pending',
      coinReward: quickOffer.coinReward,
      estimatedTime: quickOffer.estimatedTime,
      icon: '🤗',
      createdAt: new Date(),
      priority: 'medium',
      isRecurring: false
    };

    setOffers(prev => [newOffer, ...prev]);
    setShowCreateModal(false);

    // Reset form
    setQuickOffer({
      title: '',
      description: '',
      category: 'romance',
      estimatedTime: 15,
      coinReward: 25
    });

    toast({
      title: "💕 Offer Created!",
      description: "Your loving offer has been sent to Priya",
    });

    // Award coins for creating the offer
    document.dispatchEvent(new CustomEvent('gamification:action', {
      detail: { action: 'nudged_accepted', context: 'created_micro_offer' }
    }));
  };

  const createFromTemplate = (template: typeof offerTemplates.romance[0]) => {
    const newOffer: MicroOffer = {
      id: Date.now().toString(),
      fromUser: 'Arjun',
      toUser: 'Priya',
      title: template.title,
      description: template.description,
      category: selectedCategory as any,
      status: 'pending',
      coinReward: template.reward,
      estimatedTime: template.time,
      icon: template.icon,
      createdAt: new Date(),
      priority: 'medium',
      isRecurring: false
    };

    setOffers(prev => [newOffer, ...prev]);
    setShowCreateModal(false);

    toast({
      title: "💕 Template Offer Created!",
      description: `"${template.title}" has been sent to Priya`,
    });

    // Award coins for creating from template
    document.dispatchEvent(new CustomEvent('gamification:action', {
      detail: { action: 'nudged_accepted', context: 'created_template_offer' }
    }));
  };

  const stats = {
    totalSent: offers.filter(o => o.fromUser === 'Arjun').length,
    totalReceived: offers.filter(o => o.toUser === 'Arjun').length,
    completed: offers.filter(o => o.status === 'completed').length,
    pending: offers.filter(o => o.status === 'pending' || o.status === 'accepted').length,
    averageTime: Math.round(offers.reduce((sum, o) => sum + o.estimatedTime, 0) / offers.length),
    totalCoinsEarned: offers.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.coinReward, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSent}</div>
            <div className="text-sm text-gray-600">Offers Sent</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">🪙 {stats.totalCoinsEarned}</div>
            <div className="text-sm text-gray-600">Coins Earned</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">{stats.averageTime}m</div>
            <div className="text-sm text-gray-600">Avg. Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="received">Received ({stats.totalReceived})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({stats.totalSent})</TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="w-4 h-4 mr-2" />
            Create Offer
          </TabsTrigger>
        </TabsList>

        {/* Received Offers Tab */}
        <TabsContent value="received" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Offers from Priya</h3>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {stats.pending} pending
            </Badge>
          </div>

          <div className="space-y-3">
            {offers
              .filter(offer => offer.toUser === 'Arjun')
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(offer => (
                <Card key={offer.id} className="border-l-4 border-l-pink-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-2xl">{offer.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{offer.title}</h4>
                            <Badge className={getStatusColor(offer.status)}>
                              {getStatusIcon(offer.status)}
                              <span className="ml-1 capitalize">{offer.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>🪙 {offer.coinReward} coins</span>
                            <span>⏰ {offer.estimatedTime} minutes</span>
                            <span>{offer.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {offer.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => acceptOffer(offer.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => declineOffer(offer.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </>
                        )}
                        {offer.status === 'accepted' && (
                          <Button
                            size="sm"
                            onClick={() => completeOffer(offer.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Trophy className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                        {offer.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed!
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Sent Offers Tab */}
        <TabsContent value="sent" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Offers to Priya</h3>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {stats.totalSent} offers
            </Badge>
          </div>

          <div className="space-y-3">
            {offers
              .filter(offer => offer.fromUser === 'Arjun')
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(offer => (
                <Card key={offer.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-2xl">{offer.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{offer.title}</h4>
                            <Badge className={getStatusColor(offer.status)}>
                              {getStatusIcon(offer.status)}
                              <span className="ml-1 capitalize">{offer.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>🪙 {offer.coinReward} coins</span>
                            <span>⏰ {offer.estimatedTime} minutes</span>
                            <span>{offer.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Create Offer Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Create a New Offer</h3>
            <p className="text-sm text-gray-600 mb-4">
              Show Priya how much you care with a loving gesture or commitment
            </p>
          </div>

          {/* Template Selection */}
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap justify-center">
              {(Object.keys(offerTemplates) as Array<keyof typeof offerTemplates>).map(category => (
                <Button
                  key={category}
                  variant={category === selectedCategory ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-2"
                >
                  {getCategoryIcon(category)}
                  <span className="capitalize">{category.replace('-', ' ')}</span>
                </Button>
              ))}
            </div>

            {/* Template Offers */}
            <div className="grid gap-3">
              <h4 className="font-medium">Quick Templates:</h4>
              {offerTemplates[selectedCategory].map((template, index) => (
                <Card key={index} className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{template.icon}</div>
                        <div>
                          <h5 className="font-medium">{template.title}</h5>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          <div className="flex gap-4 text-xs text-gray-500 mt-1">
                            <span>🪙 {template.reward}</span>
                            <span>⏰ {template.time}m</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => createFromTemplate(template)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Custom Offer Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Create Custom Offer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Offer Title</label>
                  <Input
                    value={quickOffer.title}
                    onChange={(e) => setQuickOffer(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What's your loving gesture?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={quickOffer.description}
                    onChange={(e) => setQuickOffer(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe how you'll show your love..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Time Estimate</label>
                    <Input
                      type="number"
                      value={quickOffer.estimatedTime}
                      onChange={(e) => setQuickOffer(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 15 }))}
                      placeholder="15"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Coin Reward</label>
                    <Input
                      type="number"
                      value={quickOffer.coinReward}
                      onChange={(e) => setQuickOffer(prev => ({ ...prev, coinReward: parseInt(e.target.value) || 25 }))}
                      placeholder="25"
                    />
                  </div>
                </div>

                <Button onClick={createCustomOffer} className="w-full">
                  Create Custom Offer 💕
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MicroOfferSystem;
