import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface Comment {
  id: string;
  text: string;
  type: 'fact-check' | 'general';
  factCheck?: {
    isFactual: boolean;
    confidence: number;
    explanation: string;
    sources?: string[];
  };
  createdAt: string;
}

interface EditorCommentsProps {
  comments: Comment[];
  activeCommentId?: string;
}

export const EditorComments: React.FC<EditorCommentsProps> = ({ 
  comments, 
  activeCommentId 
}) => {
  const getFactCheckIcon = (isFactual: boolean) => {
    return isFactual ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getConfidenceBadge = (confidence: number) => {
    const percentage = Math.round(confidence * 100);
    const variant = confidence >= 0.8 ? 'default' : confidence >= 0.6 ? 'secondary' : 'destructive';
    return (
      <Badge variant={variant} className="text-xs">
        {percentage}% confidence
      </Badge>
    );
  };

  if (comments.length === 0) {
    return (
      <div className="w-80 p-4 text-center text-muted-foreground">
        <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No comments yet. Select text and right-click to add AI fact-check or comment.</p>
      </div>
    );
  }

  return (
    <div className="w-80 p-4 space-y-4 overflow-y-auto max-h-screen">
      <h3 className="text-lg font-semibold mb-4">Comments & Fact Checks</h3>
      
      {comments.map((comment) => (
        <Card 
          key={comment.id} 
          className={`transition-all ${
            activeCommentId === comment.id ? 'ring-2 ring-primary' : ''
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                {comment.type === 'fact-check' && comment.factCheck && (
                  <>
                    {getFactCheckIcon(comment.factCheck.isFactual)}
                    Fact Check
                  </>
                )}
                {comment.type === 'general' && (
                  <>
                    <Info className="h-4 w-4 text-blue-500" />
                    Comment
                  </>
                )}
              </CardTitle>
              {comment.factCheck && getConfidenceBadge(comment.factCheck.confidence)}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {comment.factCheck && (
              <div className="space-y-2 mb-3">
                <div className="text-xs text-muted-foreground">
                  Original text: "{comment.text}"
                </div>
                <p className="text-sm">{comment.factCheck.explanation}</p>
                {comment.factCheck.sources && comment.factCheck.sources.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Sources:</strong> {comment.factCheck.sources.join(', ')}
                  </div>
                )}
              </div>
            )}
            
            {comment.type === 'general' && (
              <p className="text-sm">{comment.text}</p>
            )}
            
            <div className="text-xs text-muted-foreground mt-2">
              {new Date(comment.createdAt).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};