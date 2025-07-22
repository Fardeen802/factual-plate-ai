import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { EditorComments, Comment } from './EditorComments';
import { MockAIService } from '@/services/mockAIService';
import { toast } from 'sonner';
import { 
  Brain, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Code,
  Loader2,
  Type,
  Heading1,
  Heading2,
  Quote
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PlateEditor: React.FC = () => {
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

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString() || '';
    setSelectedText(text);
  }, []);

  const formatText = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const formatBlock = useCallback((tag: string) => {
    document.execCommand('formatBlock', false, `<${tag}>`);
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

  const saveContent = useCallback(() => {
    const content = getEditorContent();
    if (content) {
      localStorage.setItem('plateEditorContent', JSON.stringify(content));
      toast.success('Content saved!');
    }
  }, [getEditorContent]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Editor Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Toolbar matching the Plate.js style from your image */}
            <div className="mb-4 flex items-center gap-2 p-2 border rounded-lg bg-card shadow-sm">
              {/* Ask AI Button - Primary Feature */}
              <Button
                variant={selectedText ? "default" : "ghost"}
                size="sm"
                onClick={handleFactCheck}
                disabled={!selectedText.trim() || isFactChecking}
                className="flex items-center gap-2 font-medium"
              >
                {isFactChecking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                Ask AI
              </Button>

              {/* Text Format Dropdown */}
              <Select onValueChange={(value) => formatBlock(value)}>
                <SelectTrigger className="w-24 h-8">
                  <SelectValue placeholder="Text" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="p">Text</SelectItem>
                  <SelectItem value="h1">Heading 1</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                </SelectContent>
              </Select>

              {/* Font Size */}
              <Select onValueChange={(value) => formatText('fontSize', value)}>
                <SelectTrigger className="w-16 h-8">
                  <SelectValue placeholder="16" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">12px</SelectItem>
                  <SelectItem value="2">14px</SelectItem>
                  <SelectItem value="3">16px</SelectItem>
                  <SelectItem value="4">18px</SelectItem>
                  <SelectItem value="5">24px</SelectItem>
                  <SelectItem value="6">32px</SelectItem>
                </SelectContent>
              </Select>

              <div className="h-6 w-px bg-border" />

              {/* Formatting Buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('bold')}
                className="p-1 h-8 w-8"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('italic')}
                className="p-1 h-8 w-8"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('underline')}
                className="p-1 h-8 w-8"
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('strikeThrough')}
                className="p-1 h-8 w-8"
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('insertHTML', '<code></code>')}
                className="p-1 h-8 w-8"
              >
                <Code className="h-4 w-4" />
              </Button>

              <div className="ml-auto">
                <Button onClick={saveContent} variant="outline" size="sm">
                  Save
                </Button>
              </div>
            </div>

            {/* Editor */}
            <div 
              ref={editorRef}
              className="min-h-[600px] bg-card rounded-lg shadow-sm border p-8 prose prose-slate dark:prose-invert max-w-none focus:outline-none"
              contentEditable
              onMouseUp={handleSelectionChange}
              onKeyUp={handleSelectionChange}
              suppressContentEditableWarning={true}
              style={{ minHeight: '600px' }}
              dangerouslySetInnerHTML={{
                __html: `
                  <h1>Welcome to the Plate Playground!</h1>
                  <p>Experience a modern rich-text editor built with <strong>Slate</strong> and <strong>React</strong>. This playground showcases just a part of Plate's capabilities.</p>
                  <p></p>
                  <p>Try these fact-check examples:</p>
                  <p>Moon is a Square.</p>
                  <p>Water boils at 100 degrees Celsius at sea level.</p>
                  <p>Humans only use 10% of their brain capacity.</p>
                  <p></p>
                  <p><em>Select any text and click "Ask AI" to fact-check it!</em></p>
                `
              }}
            />
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