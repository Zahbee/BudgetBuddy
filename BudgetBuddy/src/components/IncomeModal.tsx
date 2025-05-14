
"use client";

import React from 'react'; // Removed useState as it's not directly used here for local state
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form"; // Added Controller
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from "@/hooks/use-toast";

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigateToDashboardOnSubmit?: boolean; // New prop
}

const incomeSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  date: z.date({ required_error: "Please select a date." }),
});

type IncomeFormValues = z.infer<typeof incomeSchema>;

export function IncomeModal({ isOpen, onClose, navigateToDashboardOnSubmit = true }: IncomeModalProps) {
  const router = useRouter();
  const { setIncomeState } = useAppContext();
  const { toast } = useToast();
  
  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount: undefined,
      date: new Date(),
    },
  });

  const onSubmit = (data: IncomeFormValues) => {
    setIncomeState({ amount: data.amount, date: data.date });
    toast({
      title: "Money Added", // Changed title
      description: `₹${data.amount.toFixed(2)} has been successfully added to your income.`,
      variant: "default", 
    });
    form.reset(); // Reset form after submission
    onClose();
    if (navigateToDashboardOnSubmit) {
      router.push('/dashboard');
    }
  };

  // Reset form when dialog closes, if it's not submitted
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(); // Ensure form is reset if closed via X or overlay click
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">Add Money</DialogTitle> {/* Changed title */}
          <DialogDescription>
            Enter the amount of money and the date it was received.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground/80">Amount (₹)</Label> {/* Updated label */}
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="e.g., 5000.00"
              {...form.register("amount")}
              className="bg-background border-input focus:ring-primary"
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground/80">Date</Label>
            {/* Using Controller for the Popover-Calendar combination */}
            <Controller
              name="date"
              control={form.control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background border-input hover:bg-accent/10",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border shadow-md" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => field.onChange(date || new Date())} // Ensure a date is always passed
                      initialFocus
                      className="bg-card"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {form.formState.errors.date && (
              <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {form.reset(); onClose();}} className="hover:bg-muted/50">
              Cancel
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Add Money
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    