"use client";

import { useState, useEffect } from "react";
import {
  Copy,
  Mail,
  CheckCircle,
  RefreshCw,
  Info,
  Clipboard,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

// Utility to generate a random string
function getRandomString(length: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Home() {
  const [baseEmail, setBaseEmail] = useState("");
  const [generatedEmails, setGeneratedEmails] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("generate");
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleGenerate = () => {
    // Split base email into name and domain
    const [username, domain] = baseEmail.split("@");

    // If it's not a valid email, show toast error
    if (!username || !domain) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email like youremail@gmail.com",
        variant: "destructive",
      });
      return;
    }

    // Check if it's a Gmail address
    if (!domain.toLowerCase().includes("gmail")) {
      toast({
        title: "Gmail Required",
        description: "This feature works best with Gmail addresses",
        variant: "destructive",
      });
    }

    setIsGenerating(true);

    // Simulate loading
    setTimeout(() => {
      const tempEmails = Array.from({ length: 10 }, () => {
        const randomPart = getRandomString(6);
        return `${username}+${randomPart}@${domain}`;
      });

      setGeneratedEmails(tempEmails);
      setIsGenerating(false);
      setActiveTab("emails");

      toast({
        title: "Emails Generated",
        description: "10 temporary emails have been created for you",
      });
    }, 800);
  };

  const copyToClipboard = (email: string, index: number) => {
    navigator.clipboard.writeText(email);
    setCopiedIndex(index);

    toast({
      title: "Copied to clipboard",
      description: email,
    });

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const copyAllToClipboard = () => {
    const allEmails = generatedEmails.join("\n");
    navigator.clipboard.writeText(allEmails);

    toast({
      title: "All emails copied",
      description: "All generated emails have been copied to clipboard",
    });
  };

  const regenerateEmails = () => {
    if (!baseEmail) {
      toast({
        title: "No Email Provided",
        description: "Please enter your email first",
        variant: "destructive",
      });
      return;
    }

    handleGenerate();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold hidden md:block">MyTempMail</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column - Info */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                MyTempMail
              </CardTitle>
              <CardDescription>
                Create unlimited temporary email addresses with your Gmail
                account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4 border border-border/50">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-primary" />
                  How it works
                </h3>
                <p className="text-sm text-muted-foreground">
                  Gmail allows you to create unlimited email aliases using the{" "}
                  <code className="bg-primary/10 px-1 rounded">+</code> symbol.
                  Any email sent to{" "}
                  <code className="bg-primary/10 px-1 rounded">
                    youremail+anything@gmail.com
                  </code>{" "}
                  will be delivered to{" "}
                  <code className="bg-primary/10 px-1 rounded">
                    youremail@gmail.com
                  </code>
                  .
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Benefits:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Track which services are selling your email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Create disposable emails for sign-ups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Filter emails with custom inbox rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Protect your privacy online</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Generator */}
        <div className="w-full md:w-2/3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Email Generator</CardTitle>
              <CardDescription>
                Enter your Gmail address to generate temporary email aliases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="generate">Generate</TabsTrigger>
                  <TabsTrigger
                    value="emails"
                    disabled={generatedEmails.length === 0}
                  >
                    Your Emails
                    {generatedEmails.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {generatedEmails.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="generate" className="mt-4 space-y-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="Enter your Gmail (e.g., youremail@gmail.com)"
                        className="pr-10"
                        value={baseEmail}
                        onChange={(e) => setBaseEmail(e.target.value)}
                      />
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>

                    <Button
                      onClick={handleGenerate}
                      className="w-full"
                      disabled={isGenerating}
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Temp Emails
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="rounded-lg bg-muted p-4 border border-border/50">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-primary" />
                      Privacy Note
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your email is never stored on our servers. All email
                      generation happens in your browser.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="emails" className="mt-4">
                  {generatedEmails.length > 0 && (
                    <motion.div
                      className="space-y-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">
                          Your Temporary Emails
                        </h2>
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={copyAllToClipboard}
                                >
                                  <Clipboard className="h-4 w-4 mr-2" />
                                  {isMobile ? "" : "Copy All"}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy all emails to clipboard</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={regenerateEmails}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  {isMobile ? "" : "Regenerate"}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Generate new email aliases</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      <ScrollArea className="h-[350px] rounded-md border">
                        <div className="p-4 space-y-2">
                          {generatedEmails.map((email, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              className="flex items-center justify-between p-3 rounded-md bg-card hover:bg-muted transition-colors group border"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <Badge
                                  variant="outline"
                                  className="h-6 w-6 p-0 flex items-center justify-center rounded-full"
                                >
                                  {index + 1}
                                </Badge>
                                <span className="text-sm font-medium truncate">
                                  {email}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(email, index)}
                                className="opacity-70 group-hover:opacity-100"
                              >
                                {copiedIndex === index ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                                <span className="sr-only">Copy</span>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>

                      <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md border">
                        <p className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            These emails will forward to your main Gmail
                            account. Use them for sign-ups, newsletters, or
                            anywhere you want to protect your primary email.
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-4 border-t text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto">
          <p>
            MyTempMail &copy; {new Date().getFullYear()} - Create temporary
            email addresses with your Gmail account.
          </p>
          <p className="mt-1">
            This tool doesn&apos;t store any of your data. All processing
            happens in your browser.
          </p>
        </div>
      </footer>
    </div>
  );
}
