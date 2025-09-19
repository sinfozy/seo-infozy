import {
  BarChart3,
  CheckCircle,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Advanced Analytics",
    description: "Real-time insights with powerful data visualization",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Lightning Fast Performance",
    description: "Optimized for speed with sub-second response times",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Team Collaboration",
    description: "Seamless workflow management for distributed teams",
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Smart Targeting",
    description: "AI-powered audience segmentation and targeting",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Growth Optimization",
    description: "Automated A/B testing and conversion optimization",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Enterprise Security",
    description: "Bank-level encryption with SOC 2 compliance",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "AI-Powered Insights",
    description: "Machine learning algorithms for predictive analytics",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-sm font-medium"
          >
            Platform Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            DataFlow List of{" "}
            <span className="text-primary">Powerful Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Everything you need to transform your data into actionable insights
            and drive business growth
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="space-y-6">
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-6 border-t">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="font-semibold">4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">50,000+ active users</span>
              </div>
            </div>
          </div>

          {/* Laptop Mockup */}
          <div className="relative">
            <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Laptop Frame */}
              <div className="bg-gray-800 rounded-t-xl p-2 shadow-2xl">
                <div className="bg-gray-900 rounded-lg p-1">
                  <div className="flex items-center gap-2 mb-3 px-3 pt-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="bg-white rounded-md p-6 min-h-[400px]">
                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        Analytics Dashboard
                      </h3>
                      <Badge className="bg-primary text-primary-foreground">
                        Live Data
                      </Badge>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          $127K
                        </div>
                        <div className="text-sm text-gray-600">Revenue</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3" />
                          +12.5%
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-25 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          2.4K
                        </div>
                        <div className="text-sm text-gray-600">Users</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3" />
                          +8.2%
                        </div>
                      </div>
                    </div>

                    {/* Chart Area */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Performance Trends
                        </span>
                        <span className="text-xs text-gray-500">
                          Last 30 days
                        </span>
                      </div>

                      {/* Simple Chart Visualization */}
                      <div className="h-24 flex items-end gap-1">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                          (height, i) => (
                            <div
                              key={i}
                              className="bg-gradient-to-t from-primary to-primary/60 rounded-t flex-1"
                              style={{ height: `${height}%` }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    {/* Data Table Preview */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Recent Activity
                      </div>
                      {[
                        {
                          name: "Campaign A",
                          value: "94.2%",
                          status: "success",
                        },
                        {
                          name: "Campaign B",
                          value: "87.1%",
                          status: "success",
                        },
                        {
                          name: "Campaign C",
                          value: "76.8%",
                          status: "warning",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-sm"
                        >
                          <span className="text-gray-700">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.value}</span>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                item.status === "success"
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Base */}
              <div className="bg-gray-700 h-4 rounded-b-xl shadow-lg"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-bounce">
              Real-time
            </div>
            <div className="absolute -bottom-4 -left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              AI-Powered
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
