
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, BookOpenText, Clock } from "lucide-react";

const Index = () => {
  const modules = [
    {
      title: "待辦事項",
      description: "管理您的日常任務和待辦事項",
      icon: <CheckSquare className="h-8 w-8 text-modulear-primary" />,
      link: "/todo",
    },
    {
      title: "日記",
      description: "記錄您的日常思想和經歷",
      icon: <BookOpenText className="h-8 w-8 text-modulear-primary" />,
      link: "/diary",
    },
    {
      title: "倒數計時器",
      description: "為重要事件設置倒數計時",
      icon: <Clock className="h-8 w-8 text-modulear-primary" />,
      link: "/countdown",
    },
  ];

  return (
    <div className="py-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-modulear-primary mb-4">模組化生活管理</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          使用我們的模組化平台整理您的生活。管理待辦事項、記錄日記、追蹤重要日期等。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.title} className="hover-scale">
            <CardHeader className="pb-4">
              <div className="mb-4">{module.icon}</div>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={module.link}>開始使用</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">可擴展的模組化系統</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          我們的系統設計為可擴展的模組化平台，以後將添加更多功能模組。
        </p>
      </div>
    </div>
  );
};

export default Index;
