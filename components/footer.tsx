"use client";

import { Text, Button, Link } from "@radix-ui/themes";
import Logo from "@/components/ui/logo";

const Footer = () => {
  return (
    <footer className="max-w-6xl w-full border-t border-foreground/10 flex justify-between items-center opacity-60 py-5">
        {/* Left Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-6">
            <div className="flex flex-row items-center">
                <Logo/>
                <Text weight="bold">Ascend</Text>
            </div>
            <Button variant="outline" size="1" asChild>
                <Link color="gray">Install Ascend</Link>
            </Button>
          </div>
          <div className="text-xs translate-x-2">
            © Copyright 2024-2025, Romeo Beaurain. All rights reserved.
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-start gap-1 text-xs">
          <span>Facing issues? <Link href="/" weight="bold">Get help</Link></span>
          <span>Suggestions for improvement? <Link href="/" weight="bold">Share feedback</Link></span>
        </div>
    </footer>
  );
};

export default Footer;