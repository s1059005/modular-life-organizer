import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Copy } from "lucide-react";
import { useToast } from "./ui/use-toast";

type ComplexityLevel = 'low' | 'medium' | 'high';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [complexity, setComplexity] = useState<ComplexityLevel>('medium');
  const [length, setLength] = useState(12);
  const { toast } = useToast();

  const generatePassword = () => {
    let chars = '';
    
    switch (complexity) {
      case 'low':
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;
      case 'medium':
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        break;
      case 'high':
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        break;
    }

    let result = '';
    const charsLength = chars.length;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charsLength));
    }

    setPassword(result);
  };

  const copyToClipboard = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      toast({
        title: "已複製到剪貼簿",
        duration: 2000,
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>密碼生成器</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>複雜度</Label>
          <Select
            value={complexity}
            onValueChange={(value: ComplexityLevel) => setComplexity(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="選擇複雜度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低 (只有字母)</SelectItem>
              <SelectItem value="medium">中 (字母和數字)</SelectItem>
              <SelectItem value="high">高 (字母、數字和特殊符號)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>密碼長度: {length}</Label>
          <Input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
          />
        </div>

        <div className="flex gap-2">
          <Input
            value={password}
            readOnly
            placeholder="生成的密碼將顯示在這裡"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            disabled={!password}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={generatePassword} className="w-full">
          生成密碼
        </Button>
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator; 