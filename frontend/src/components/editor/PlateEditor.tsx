import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
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
import { getPage, updatePage } from '@/services/pageService';
import { debounce } from '@/services/debouce';

export const PlateEditor: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [isFactChecking, setIsFactChecking] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string>();
  const editorRef = useRef<HTMLDivElement>(null);
  const [pageId, setPageId] = useState<string | null>('6880685272487d5a361368e9');
  const [loading, setLoading] = useState(false);
  const [floatingFact, setFloatingFact] = useState<{
    explanation: string;
    isFactual: boolean;
    position: { top: number; left: number } | null;
  } | null>(null);

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
      // Floating fact message logic
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        // Find editor's bounding rect for relative positioning
        const editorRect = editorRef.current?.getBoundingClientRect();
        if (editorRect) {
          // Adjust for scroll and more accurate placement
          const scrollY = window.scrollY || window.pageYOffset;
          const scrollX = window.scrollX || window.pageXOffset;
          setFloatingFact({
            explanation: result.explanation,
            isFactual: result.isFactual,
            position: {
     
              top: rect.bottom + scrollY - editorRect.top + 100,
              left: rect.left + scrollX - editorRect.left + 200, 
            },
          });
        }
      }
      
      toast.success('Fact-check completed!');
    } catch (error) {
      console.error('Fact-check error:', error);
      toast.error('Failed to perform fact-check');
    } finally {
      setIsFactChecking(false);
    }
  }, [selectedText, editorRef, setComments]);

  // Hide floating fact on click anywhere else
  React.useEffect(() => {
    if (!floatingFact) return;
    const handler = () => setFloatingFact(null);
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [floatingFact]);

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

  const saveContent = useCallback(async () => {
    const content = getEditorContent();
    if (!content) return;
    setLoading(true);
    try {
      let result;
      if (pageId) {
        result = await updatePage(pageId, content);
        toast.success('Content updated in database!');
      }
    } catch (err) {
      toast.error('Failed to save content to database');
    } finally {
      setLoading(false);
    }
  }, [getEditorContent]);


  useEffect(()=>{
    const fetch = async()=>{
      setLoading(true);
    try {
      const result = await getPage(pageId);
      if (editorRef.current && result.content) {
        editorRef.current.innerHTML = result.content.html || '';
        setComments(result.content.comments || []);
        toast.success('Content loaded from database!');
      }
    } catch (err) {
      toast.error('Failed to load content from database');
    } finally {
      setLoading(false);
    }
    }
    fetch();
  },
  [])
  const debouncedSave = useMemo(
    () =>
      debounce(() => {
        const content = getEditorContent();
        if (content) {
          updatePage(pageId!, content);
        }
      }, 1000),
    [getEditorContent]
  );

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

              <div className="ml-auto flex gap-2">
                <Button onClick={saveContent} variant="outline" size="sm" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
  

              </div>
            </div>

            {/* Editor */}
            <div 
              ref={editorRef}
              className="min-h-[600px] bg-card rounded-lg shadow-sm border p-8 prose prose-slate dark:prose-invert max-w-none focus:outline-none relative"
              contentEditable
              onMouseUp={handleSelectionChange}
              onKeyUp={handleSelectionChange}
              suppressContentEditableWarning={true}
              onInput={debouncedSave} 
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
            >
            </div>
            {/* Floating Fact Message */}
            {floatingFact && floatingFact.position && (
              <div
                style={{
                  position: 'absolute',
                  top: floatingFact.position.top,
                  left: floatingFact.position.left,
                  zIndex: 100,
                  minWidth: 240,
                  maxWidth: 320,
                  background: floatingFact.isFactual ? 'white' : '#fee2e2',
                  color: '#111',
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  padding: '12px 16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  {floatingFact.isFactual ? 'Factually Correct' : '⚠️ Possibly Incorrect'}
                </div>
                <div>{floatingFact.explanation}</div>
              </div>
            )}
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