import React, { useState, useCallback, useRef } from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { EditorComments, Comment } from './EditorComments';
import { MockAIService } from '@/services/mockAIService';
import { toast } from 'sonner';
import { Brain, MessageSquare, Loader2, Bold, Italic, Underline } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SimpleEditor: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [isFactChecking, setIsFactChecking] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string>();
  const editorRef = useRef<HTMLDivElement>(null);

  const handleFactCheck = useCallback(async () => {
    if (!selectedText.trim()) {
      toast.error('Please select some text to fact-check');
      return;
    }

    setIsFactChecking(true);
    try {
      const result = await MockAIService.factCheck(selectedText);
      
      const newComment: Comment = {
        id: Date.now().toString(),
        text: result.originalText,
        type: 'fact-check',
        factCheck: {
          isFactual: result.isFactual,
          confidence: result.confidence,
          explanation: result.explanation,
          sources: result.sources,
        },
        createdAt: new Date().toISOString(),
      };

      setComments(prev => [...prev, newComment]);
      setActiveCommentId(newComment.id);
      
      toast.success('Fact-check completed!');
    } catch (error) {
      console.error('Fact-check error:', error);
      toast.error('Failed to perform fact-check');
    } finally {
      setIsFactChecking(false);
    }
  }, [selectedText]);

  const handleAddComment = useCallback(() => {
    if (!selectedText.trim()) {
      toast.error('Please select some text to comment on');
      return;
    }

    const commentText = prompt('Enter your comment:');
    if (!commentText) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      type: 'general',
      createdAt: new Date().toISOString(),
    };

    setComments(prev => [...prev, newComment]);
    setActiveCommentId(newComment.id);
    toast.success('Comment added!');
  }, [selectedText]);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString() || '';
    setSelectedText(text);
  }, []);

  const formatText = useCallback((command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  }, []);

  const getEditorContent = useCallback(() => {
    if (editorRef.current) {
      return {
        html: editorRef.current.innerHTML,
        text: editorRef.current.innerText,
        comments: comments
      };
    }
    return null;
  }, [comments]);

  // Save content to localStorage whenever it changes
  const saveContent = useCallback(() => {
    const content = getEditorContent();
    if (content) {
      localStorage.setItem('editorContent', JSON.stringify(content));
      toast.success('Content saved!');
    }
  }, [getEditorContent]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Editor Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Toolbar */}
            <div className="mb-4 flex items-center gap-2 p-2 border rounded-lg bg-card">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('bold')}
                className="flex items-center gap-1"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('italic')}
                className="flex items-center gap-1"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('underline')}
                className="flex items-center gap-1"
              >
                <Underline className="h-4 w-4" />
              </Button>
              <div className="ml-auto">
                <Button onClick={saveContent} variant="outline" size="sm">
                  Save Content
                </Button>
              </div>
            </div>

            {/* Editor */}
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div 
                  ref={editorRef}
                  className="min-h-[600px] bg-card rounded-lg shadow-sm border p-8 prose prose-slate dark:prose-invert max-w-none focus:outline-none"
                  contentEditable
                  onMouseUp={handleSelectionChange}
                  onKeyUp={handleSelectionChange}
                  dangerouslySetInnerHTML={{
                    __html: `
                      <h1>AI Fact-Check Editor</h1>
                      <p>Welcome to the AI-powered fact-checking editor. Try selecting some text and right-clicking to fact-check it.</p>
                      <p></p>
                      <p>Example claims to test:</p>
                      <p>• The Earth is flat and space is fake.</p>
                      <p>• Water boils at 100 degrees Celsius at sea level.</p>
                      <p>• Humans only use 10% of their brain capacity.</p>
                      <p></p>
                      <p><em>Start typing to add your own content...</em></p>
                    `
                  }}
                />
              </ContextMenuTrigger>
              
              <ContextMenuContent className="w-64">
                <ContextMenuItem 
                  onClick={handleFactCheck}
                  disabled={!selectedText.trim() || isFactChecking}
                  className="flex items-center gap-2"
                >
                  {isFactChecking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}
                  {isFactChecking ? 'Fact-checking...' : 'AI Fact Check'}
                </ContextMenuItem>
                
                <ContextMenuItem 
                  onClick={handleAddComment}
                  disabled={!selectedText.trim()}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Add Comment
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </div>

        {/* Comments Sidebar */}
        <div className="border-l bg-muted/30">
          <EditorComments 
            comments={comments}
            activeCommentId={activeCommentId}
          />
        </div>
      </div>
    </div>
  );
};