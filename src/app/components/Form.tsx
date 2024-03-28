'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

/**
 * Reusable hook for zod + react-hook-form
 */
export function useZodForm<TInput extends FieldValues>(
  props: Omit<UseFormProps<TInput>, 'resolver'> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.ZodType<any, any, TInput>
  },
) {
  const form = useForm<TInput>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      raw: true,
    }),
  })

  return form
}

export const Form = <TInput extends FieldValues = never>(props: {
  children: React.ReactNode
  form: UseFormReturn<TInput>
  handleSubmit: (values: NoInfer<TInput>) => Promise<unknown>
  className?: string
}) => {
  return (
    <FormProvider {...props.form}>
      <form
        className={props.className}
        onSubmit={(event) => {
          return props.form.handleSubmit(async (values) => {
            try {
              await props.handleSubmit(values)
            } catch (error) {
              console.error('Uncaught error in form', error)
              toast.error('Failed to submit form')
            }
          })(event)
        }}
      >
        {props.children}
      </form>
    </FormProvider>
  )
}
