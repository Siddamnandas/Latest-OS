"use client"

import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  User, 
  Settings, 
  Bell, 
  Heart,
  Calendar,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Star,
  Clock,
  Activity,
  Target,
  Lightbulb,
  Smartphone
} from 'lucide-react'

export default function TabStyleDemo() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Enhanced Tab Component Showcase</h1>
        <p className="text-muted-foreground">Beautiful, modern tabs with smooth animations and attractive styling</p>
      </div>

      {/* Basic Tab Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Basic Enhanced Tabs
          </CardTitle>
          <CardDescription>
            Clean and simple tabs with hover effects and smooth transitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="home" className="w-full">
            <TabsList>
              <TabsTrigger value="home">
                <Home className="w-4 h-4" />
                Home
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4" />
                Notifications
                <Badge className="ml-1 bg-red-500 text-white text-xs">3</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="home" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Welcome Home!</h3>
                <p className="text-muted-foreground">This is your dashboard with beautiful gradient backgrounds.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Your Profile</h3>
                <p className="text-muted-foreground">Manage your personal information and preferences here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Settings</h3>
                <p className="text-muted-foreground">Configure your application preferences and options.</p>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                <p className="text-muted-foreground">You have 3 new notifications waiting for you.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Wide Tab Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Dashboard Navigation
          </CardTitle>
          <CardDescription>
            Full-width tabs perfect for main navigation sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <Activity className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="goals">
                <Target className="w-4 h-4" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Lightbulb className="w-4 h-4" />
                Insights
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-200/50">
                  <h4 className="font-semibold text-blue-700">Total Users</h4>
                  <p className="text-2xl font-bold text-blue-800">12,347</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg border border-green-200/50">
                  <h4 className="font-semibold text-green-700">Revenue</h4>
                  <p className="text-2xl font-bold text-green-800">$45,892</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-200/50">
                  <h4 className="font-semibold text-purple-700">Growth</h4>
                  <p className="text-2xl font-bold text-purple-800">+24.5%</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">Detailed analytics and performance metrics would be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="goals" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Goals & Targets</h3>
                <p className="text-muted-foreground">Set and track your business objectives and key results.</p>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
                <p className="text-muted-foreground">Smart recommendations and insights powered by AI analysis.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Mobile-Style Tab Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-green-500" />
            Mobile Navigation Style
          </CardTitle>
          <CardDescription>
            Compact tabs optimized for mobile interfaces with icons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="today" className="flex-col gap-1 h-16 py-2">
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Today</span>
              </TabsTrigger>
              <TabsTrigger value="heart" className="flex-col gap-1 h-16 py-2">
                <Heart className="w-5 h-5" />
                <span className="text-xs">Love</span>
              </TabsTrigger>
              <TabsTrigger value="time" className="flex-col gap-1 h-16 py-2">
                <Clock className="w-5 h-5" />
                <span className="text-xs">Time</span>
              </TabsTrigger>
              <TabsTrigger value="global" className="flex-col gap-1 h-16 py-2">
                <Globe className="w-5 h-5" />
                <span className="text-xs">Global</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-col gap-1 h-16 py-2">
                <Shield className="w-5 h-5" />
                <span className="text-xs">Safe</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Today's Schedule</h3>
                <p className="text-muted-foreground">Your daily tasks and appointments are organized here.</p>
              </div>
            </TabsContent>

            <TabsContent value="heart" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-pink-50 to-red-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Relationship Hub</h3>
                <p className="text-muted-foreground">Connect with loved ones and manage your relationships.</p>
              </div>
            </TabsContent>

            <TabsContent value="time" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Time Management</h3>
                <p className="text-muted-foreground">Track your time and improve productivity.</p>
              </div>
            </TabsContent>

            <TabsContent value="global" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Global Network</h3>
                <p className="text-muted-foreground">Connect with people around the world.</p>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <div className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Security Center</h3>
                <p className="text-muted-foreground">Manage your privacy and security settings.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Enhanced Features
          </CardTitle>
          <CardDescription>
            Key improvements in the new tab design
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
              <h4 className="font-semibold text-blue-700 mb-2">Smooth Animations</h4>
              <p className="text-sm text-blue-600">Fluid transitions with GPU acceleration and easing functions</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200/50">
              <h4 className="font-semibold text-purple-700 mb-2">Gradient Backgrounds</h4>
              <p className="text-sm text-purple-600">Beautiful gradients for active states with shadow effects</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
              <h4 className="font-semibold text-green-700 mb-2">Enhanced Accessibility</h4>
              <p className="text-sm text-green-600">Improved focus states and keyboard navigation</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200/50">
              <h4 className="font-semibold text-orange-700 mb-2">Scale Animations</h4>
              <p className="text-sm text-orange-600">Subtle scale transforms on hover and active states</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200/50">
              <h4 className="font-semibold text-cyan-700 mb-2">Glass Morphism</h4>
              <p className="text-sm text-cyan-600">Modern backdrop blur effects and translucent backgrounds</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200/50">
              <h4 className="font-semibold text-yellow-700 mb-2">Dark Mode Ready</h4>
              <p className="text-sm text-yellow-600">Full support for dark theme with optimized colors</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}