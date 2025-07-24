import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

const VoiceChatFrame = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all duration-300"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Frame */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl transition-all duration-300">
          <div className="p-3 border-b border-border">
            <h3 className="font-semibold text-foreground">Voice Assistant</h3>
            <p className="text-sm text-muted-foreground">Chat with our AI assistant</p>
          </div>
          <iframe
            src="https://backend.omnidim.io/web_widget.js?secret_key=4dbf701ff41cad536cc102f698a57155"
            className="w-full h-80 border-0 rounded-b-lg"
            title="Voice Chat Assistant"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
      )}
    </>
  );
};

export default VoiceChatFrame;