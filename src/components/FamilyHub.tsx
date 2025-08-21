'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParentingActivityEngine } from '@/components/ParentingActivityEngine';
import { FridgeToTable } from '@/components/FridgeToTable';
import { 
  Baby, 
  ChefHat,
  Heart,
  Users
} from 'lucide-react';

interface FamilyHubProps {
  coupleId: string;
}

export function FamilyHub({ coupleId }: FamilyHubProps) {
  const [activeTab, setActiveTab] = useState('activities');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Family Hub</h1>
            <p className="text-gray-600">Activities, meals, and family bonding</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b">
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Baby className="w-4 h-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              Meals & Planning
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="mt-0">
            <ParentingActivityEngine />
          </TabsContent>

          <TabsContent value="meals" className="mt-0">
            <FridgeToTable coupleId={coupleId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}