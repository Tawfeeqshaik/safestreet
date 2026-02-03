import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Twitter, Linkedin, Link2, Loader2, Share2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WalkScoreResult {
  score: number;
  category: 'high' | 'moderate' | 'low';
  label: string;
}

interface ShareScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  walkScore: WalkScoreResult;
  fromLocation: string;
  toLocation: string;
}

export function ShareScoreModal({ 
  isOpen, 
  onClose, 
  walkScore, 
  fromLocation, 
  toLocation 
}: ShareScoreModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-share-image', {
        body: {
          score: walkScore.score,
          category: walkScore.category,
          label: walkScore.label,
          fromLocation,
          toLocation,
        },
      });

      if (error) throw error;
      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success('Share image generated!');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `walkscore-${walkScore.score}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  const shareToTwitter = () => {
    const text = `I just checked my walkability score! 🚶‍♂️\n\nRoute: ${fromLocation} → ${toLocation}\nWalk Score: ${walkScore.score}/100 - ${walkScore.label}\n\n#WalkScore #Walkability #SustainableCities`;
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const copyLink = async () => {
    const text = `WalkScore: ${walkScore.score}/100 - ${walkScore.label}\nRoute: ${fromLocation} → ${toLocation}\n${window.location.origin}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setGeneratedImage(null);
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share Your Walk Score
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Score Preview */}
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <div className="text-4xl font-bold text-primary mb-1">{walkScore.score}/100</div>
            <div className="text-sm text-muted-foreground">{walkScore.label}</div>
            <div className="text-xs text-muted-foreground mt-2 truncate">
              {fromLocation} → {toLocation}
            </div>
          </div>

          {/* Generated Image */}
          {generatedImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl overflow-hidden border border-border"
            >
              <img 
                src={generatedImage} 
                alt="Share card" 
                className="w-full h-auto"
              />
            </motion.div>
          )}

          {/* Generate Button */}
          {!generatedImage && (
            <Button 
              onClick={generateImage} 
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Generate Share Image
                </>
              )}
            </Button>
          )}

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={shareToTwitter}
              className="w-full"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button 
              variant="outline" 
              onClick={shareToLinkedIn}
              className="w-full"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={copyLink}
              className="w-full"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 mr-2 text-status-safe" />
              ) : (
                <Link2 className="w-4 h-4 mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            {generatedImage && (
              <Button 
                variant="outline" 
                onClick={downloadImage}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
