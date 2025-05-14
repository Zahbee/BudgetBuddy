
"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb } from 'lucide-react';
import { personalizedSavingsSuggestions, type PersonalizedSavingsSuggestionsInput } from '@/ai/flows/personalized-savings-suggestions';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext'; // To get existing expenses

const suggestionsSchema = z.object({
  spendingData: z.string().min(10, { message: "Please provide some details about your spending." }),
  financialGoals: z.string().min(5, { message: "Please describe your financial goals." }),
});

type SuggestionsFormValues = z.infer<typeof suggestionsSchema>;

export default function SavingsPageClient() {
  const { expenses, income } = useAppContext();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill spending data based on context
  const generateSpendingSummary = () => {
    if (!income && expenses.length === 0) {
      return "";
    }
    let summary = `Recent Income: $${income?.amount.toFixed(2) || 'Not specified'}.\n\nRecent Expenses:\n`;
    if (expenses.length > 0) {
      expenses.forEach(exp => {
        summary += `- ${exp.name} ($${exp.amount.toFixed(2)}) - Category: ${exp.category} (${exp.type})\n`;
      });
    } else {
      summary += "No expenses recorded yet.\n";
    }
    return summary;
  };

  const form = useForm<SuggestionsFormValues>({
    resolver: zodResolver(suggestionsSchema),
    defaultValues: {
      spendingData: generateSpendingSummary(),
      financialGoals: "",
    },
  });

  const onSubmit = async (data: SuggestionsFormValues) => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const aiInput: PersonalizedSavingsSuggestionsInput = {
        spendingData: data.spendingData,
        financialGoals: data.financialGoals,
      };
      const result = await personalizedSavingsSuggestions(aiInput);
      setSuggestions(result.suggestions);
      toast({
        title: "Suggestions Generated!",
        description: "AI has provided personalized savings tips.",
      });
    } catch (error) {
      console.error("Error fetching savings suggestions:", error);
      toast({
        title: "Error",
        description: "Could not fetch savings suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card className="shadow-xl rounded-lg">
        <CardHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold text-primary">Personalized Savings Suggestions</CardTitle>
          </div>
          <CardDescription>
            Let our AI analyze your spending habits and financial goals to provide tailored advice on how to save more effectively.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="spendingData" className="text-lg font-medium">Your Spending Habits</Label>
              <Controller
                name="spendingData"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    id="spendingData"
                    placeholder="Describe your recent spending. e.g., Monthly rent $1200, Groceries $400, Dining out $200..."
                    className="min-h-[120px] mt-2 bg-background focus:ring-primary"
                    {...field}
                  />
                )}
              />
              {form.formState.errors.spendingData && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.spendingData.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="financialGoals" className="text-lg font-medium">Your Financial Goals</Label>
               <Controller
                name="financialGoals"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    id="financialGoals"
                    placeholder="What are you saving for? e.g., Down payment for a house, emergency fund, vacation..."
                    className="min-h-[80px] mt-2 bg-background focus:ring-primary"
                    {...field}
                  />
                )}
              />
              {form.formState.errors.financialGoals && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.financialGoals.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Get Savings Suggestions"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {suggestions.length > 0 && (
        <Card className="mt-8 shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">Here are your suggestions:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-3 pl-5 text-foreground/90">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-base leading-relaxed bg-primary/5 p-3 rounded-md border border-primary/20">
                  {suggestion}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
