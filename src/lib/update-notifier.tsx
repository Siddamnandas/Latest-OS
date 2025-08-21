"use client";

import { useEffect } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { checkExpoUpdate, reloadExpoUpdate } from "@/lib/updates";

export function UpdateNotifier() {
  const { toast } = useToast();

  useEffect(() => {
    async function check() {
      const hasUpdate = await checkExpoUpdate();
      if (hasUpdate) {
        toast({
          title: "Update available",
          description: "A new version has been downloaded.",
          action: (
            <ToastAction altText="Reload" onClick={reloadExpoUpdate}>
              Reload
            </ToastAction>
          ),
        });
      }
    }
    check();
  }, [toast]);

  return null;
}
