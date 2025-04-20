"use client";
import React from "react";
import Button from '@/components/base/Button';
import Input from '@/components/base/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/select';
import { Card, CardContent } from '@/components/base/Card';
import DatePicker from '@/components/base/DatePicker';
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalSchema, GoalFormValues } from '@/lib/validationSchemas';

interface IGoalModalProps {
  onClose: () => void;
  onSave: (goalData: GoalFormValues) => void;
}

const GoalModal = ({ onClose, onSave }: IGoalModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goal_name: "",
      goal_category: "Other",
      target_amount: 0,
      initial_investment: 0,
      currency: "INR",
      contribution_frequency: "Monthly",
      priority_level: "Medium",
      goal_type: "Savings",
      reminder_frequency: "None",
      is_completed: false,
    },
  });

  const onSubmit: SubmitHandler<GoalFormValues> = async (data) => {
    try {
      onSave(data);
      onClose();
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  const FormField = ({ label, children, error }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
//  shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a] flex justify-center items-center
  return (
    <div className="fixed inset-0 z-50 bg-opacity-40 backdrop-blur-sm flex justify-center items-center p-4">
      <Card className="w-full max-w-xl bg-white rounded-2xl border-0 shadow-xl transform transition-all">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="bg-[#004a7c] p-2 rounded-full">
                <Image
                  alt="Goal Icon"
                  src="/goal_icon.svg"
                  width={24}
                  height={24}
                  className="text-white"
                />
              </div>
              <h2 className="font-medium text-2xl text-[#004a7c] ml-3">
                Create a New Goal
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Goal Name" error={errors.goal_name}>
                <Input
                  type="text"
                  {...register("goal_name")}
                  placeholder="Enter your goal name..."
                  className="w-full h-12 rounded-lg border-2 border-[#00a9e0] focus:border-[#004a7c] focus:ring-0 px-4 transition-colors"
                />
              </FormField>

              <FormField label="Goal Category" error={errors.goal_category}>
                <Select onValueChange={(value) => setValue('goal_category', value)}>
                  <SelectTrigger
                    className='w-full h-12 rounded-lg border-2 border-[#00a9e0] focus:border-[#004a7c] focus:ring-0 px-4 transition-colors'
                  >
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent className='bg-white rounded-md shadow-lg'>
                    <SelectItem value='Education'>Education</SelectItem>
                    <SelectItem value='Retirement'>Retirement</SelectItem>
                    <SelectItem value='Travel'>Travel</SelectItem>
                    <SelectItem value='Investment'>Investment</SelectItem>
                    <SelectItem value='Other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Target Amount" error={errors.target_amount}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm pr-1">₹ </span>
                  </div>
                  <Input
                    type="number"
                    {...register("target_amount", { valueAsNumber: true })}
                    placeholder="0.00"
                    className="w-full h-12 pl-8 rounded-lg border-2 border-[#00a9e0] focus:border-[#004a7c] focus:ring-0 px-4 transition-colors"
                  />
                </div>
              </FormField>

              <FormField label="Initial Investment" error={errors.initial_investment}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm pr-1">₹ </span>
                  </div>
                  <Input
                    type="number"
                    {...register("initial_investment", { valueAsNumber: true })}
                    placeholder="0.00"
                    className="w-full h-12 pl-8 rounded-lg border-2 border-[#00a9e0] focus:border-[#004a7c] focus:ring-0 px-4 transition-colors"
                  />
                </div>
              </FormField>

              <FormField label="Currency" error={errors.goal_category}>
                <Select onValueChange={(value) => setValue('currency', value)}>
                  <SelectTrigger
                    className='w-full h-12 rounded-lg border-2 border-[#00a9e0] focus:border-[#004a7c] focus:ring-0 px-4 transition-colors'
                  >
                    <SelectValue placeholder='Select a currency' />
                  </SelectTrigger>
                  <SelectContent className='bg-white rounded-md shadow-lg'>
                    <SelectItem value='USD'>USD</SelectItem>
                    <SelectItem value='EUR'>EUR</SelectItem>
                    <SelectItem value='INR'>INR</SelectItem>
                    <SelectItem value='GBP'>GBP</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Target Date" error={errors.target_date}>
                <DatePicker
                  selected={new Date()}
                  onChange={(date) => setValue("target_date", date)}
                  className="w-full h-12 rounded-lg border-2 border-[#00a9e0] focus:border-[#004a7c] focus:ring-0 px-4 transition-colors"
                />
              </FormField>

              <FormField label="Contribution Frequency" error={errors.goal_category}>
                <Select onValueChange={(value) => setValue('contribution_frequency', value)}>
                  <SelectTrigger
                    className='w-full h-12 rounded-lg border-2 border-[#00a9e0] focus:border-[#004a7c] focus:ring-0 px-4 transition-colors'
                  >
                    <SelectValue placeholder='Choose an option' />
                  </SelectTrigger>
                  <SelectContent className='bg-white rounded-md shadow-lg'>
                    <SelectItem value='Monthly'>Monthly</SelectItem>
                    <SelectItem value='Quarterly'>Quarterly</SelectItem>
                    <SelectItem value='Yearly'>Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Priority Level" error={errors.priority_level}>
                <div className="flex space-x-2">
                  {["Low", "Medium", "High"].map((priority) => (
                    <label key={priority} className="flex-1">
                      <input
                        type="radio"
                        value={priority}
                        {...register("priority_level")}
                        className="sr-only peer"
                      />
                      <div className={`
                        h-12 flex items-center justify-center rounded-lg
                        border-2 border-[#00a9e0] cursor-pointer transition-all
                        peer-checked:bg-[#004a7c] peer-checked:text-white
                        peer-checked:border-[#004a7c] hover:bg-[#e6f7fd]
                      `}>
                        {priority}
                      </div>
                    </label>
                  ))}
                </div>
              </FormField>
            </div>

            <div className="pt-4 flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full h-12 bg-[#004a7c] hover:bg-[#003a62] text-white font-medium rounded-lg transition-colors shadow-md"
              >
                Save Goal
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 bg-white border-2 border-[#00a9e0] text-[#00a9e0] hover:bg-[#e6f7fd] font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalModal;
