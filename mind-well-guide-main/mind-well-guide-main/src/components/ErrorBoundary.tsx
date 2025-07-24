import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-md glass border-0 shadow-mindful">
              <CardHeader className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="mx-auto mb-4"
                >
                  <AlertTriangle className="w-16 h-16 text-yellow-500" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Oops! Something went wrong
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  We're sorry, but something unexpected happened. Don't worry - your data is safe and local.
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={this.handleReset}
                    className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="w-full"
                  >
                    Reload Page
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground pt-4 border-t">
                  <p>If this keeps happening, try:</p>
                  <ul className="list-disc list-inside text-left mt-2 space-y-1">
                    <li>Refreshing the page</li>
                    <li>Clearing your browser cache</li>
                    <li>Checking your internet connection</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;