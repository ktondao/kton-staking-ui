'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn, useForm } from 'react-hook-form';
import { useEffect, forwardRef, useImperativeHandle, memo, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { validateNotGreaterThan } from '@/utils';

const formSchema = z.object({
  amount: z.string().refine((v) => {
    const numberValue = Number(v);
    return !Number.isNaN(numberValue) && numberValue > 0;
  })
});

export type SubmitData = z.infer<typeof formSchema>;

interface AmountInputFormProps {
  onSubmit: (data: SubmitData) => void;
  etherBalance: string;
  children?: React.ReactNode;
  renderBalance?: React.ReactNode;
  className?: string;
  onAmountChange?: (amount: string) => void;
}

export type Form = UseFormReturn<
  {
    amount: string;
  },
  any,
  {
    amount: string;
  }
>;

const AmountInputForm = forwardRef<Form, AmountInputFormProps>(
  ({ renderBalance, etherBalance, onSubmit, onAmountChange, children, className }, ref) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        amount: ''
      }
    });

    const { watch, setError, clearErrors } = form;

    const watchedAmount = watch('amount');

    const validateAmount = useCallback((): boolean => {
      const isValid = validateNotGreaterThan(watchedAmount, etherBalance);
      if (!isValid) {
        setError('amount', {
          type: 'manual'
        });
        return false;
      }
      clearErrors('amount');
      return true;
    }, [watchedAmount, etherBalance, setError, clearErrors]);

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
      const isValid = validateAmount();
      isValid && onSubmit(data);
    };

    useEffect(() => {
      if (watchedAmount === '') {
        onAmountChange && onAmountChange(watchedAmount);
        return;
      }
      const isValid = validateAmount();
      if (isValid) {
        onAmountChange && onAmountChange(watchedAmount);
      }
    }, [watchedAmount, validateAmount, onAmountChange]);

    useImperativeHandle(ref, () => form, [form]);

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className={cn('space-y-4', className)}>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex justify-center">
                    <Input
                      placeholder="0.000"
                      {...field}
                      className={cn(
                        'flex items-center gap-[0.625rem] self-stretch rounded-[0.3125rem] border  bg-[#242a2e] px-[0.625rem] pb-[0.625rem] pt-[0.4375rem] text-base focus-visible:ring-0 focus-visible:transition-all',
                        form.formState.errors.amount ? 'border-red-500' : 'border-white',
                        form.formState.errors.amount
                          ? 'focus-visible:outline-red-500/30'
                          : 'focus-visible:outline-primary/30 '
                      )}
                      autoComplete="off"
                    />
                    <Button
                      type="button"
                      className="absolute right-[0.44rem] top-[0.44rem] h-[1.625rem] rounded-[0.125rem] border border-primary bg-transparent text-white"
                      onClick={() => form.setValue('amount', etherBalance)}
                    >
                      MAX
                    </Button>
                  </div>
                </FormControl>
                {renderBalance ? (
                  <FormDescription className=" mt-[0.62rem] flex items-center text-[0.75rem] font-bold leading-normal">
                    Balance: {renderBalance}
                  </FormDescription>
                ) : null}
              </FormItem>
            )}
          />
          {children}
        </form>
      </Form>
    );
  }
);
AmountInputForm.displayName = 'AmountInputForm';

export default memo(AmountInputForm);
