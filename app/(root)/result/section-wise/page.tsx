/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axiosRequest from '@/hooks/axiosRequest';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface StudentResult {
  id: number;
  name: string;
  student_id: string;
  student_roll: string;
  class_name: string;
  group: string;
  section: string;
  shift: string;
  exam_name: string;
  year: string;
  subject: string;
  full_marks: string;
  short_marks: string;
  total_marks: string;
  grade: string;
  gpa: string;
  school_code: string;
  action: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SectionWiseResultParams {
  exam_name: string;
  year: string;
  class_name: string;
  section: string;
  school_code: number;
}

const useGetSectionWiseResult = () => {
  return useMutation<StudentResult[], Error, SectionWiseResultParams>({
    mutationFn: async (params) => {
      const response = await axiosRequest({
        url: `/api/student-result-by-section`,
        method: 'GET',
        params: params,
        baseURL: 'https://academichelperbd.com',
      });
      return response.data;
    },
  });
};

const SectionWiseResult = () => {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [responseError, setError] = useState<any>('');

  const form = useForm({
    defaultValues: {
      examName: '',
      class: '',
      academicYear: '',
      section: '',
    },
  });

  const { mutate, isPending, error } = useGetSectionWiseResult();

  const onSubmit = (values: any) => {
    const formattedExamName = values.examName
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    mutate(
      {
        exam_name: formattedExamName,
        year: values.academicYear,
        class_name: values.class,
        section: values.section,
        school_code: 10109,
      },
      {
        onSuccess: (data) => {
          setResults(data);
        },
        onError: (err) => {
          setError(err.message);
          console.error('Error fetching results:', err);
        },
      },
    );
  };

  const errorMessage = error instanceof Error ? error.message : 'An error occurred';

  return (
    <div className="pb-6">
      <h2 className="heading">Section Wise Result</h2>
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-5 items-end py-4 pb-6">
            <FormField
              control={form.control}
              name="examName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Select Exam Name*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none py-6 placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Exam Name*"
                          className="placeholder:opacity-25 rounded-none "
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="half-yearly-exam">Half Yearly Exam</SelectItem>
                      <SelectItem value="annual-exam">Annual Exam</SelectItem>
                      <SelectItem value="pre-test-exam">Pre-Test Exam</SelectItem>
                      <SelectItem value="test-exam">Test Exam</SelectItem>
                      <SelectItem value="2nd-assessment-exam">2nd Assessment Exam</SelectItem>
                      <SelectItem value="final-exam">Final Exam</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Select Class*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-x-0 py-6 placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Class*"
                          className="placeholder:opacity-25 rounded-none "
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Play</SelectItem>
                      <SelectItem value="2">Nursery</SelectItem>
                      <SelectItem value="3">KG</SelectItem>
                      <SelectItem value="4">One</SelectItem>
                      <SelectItem value="5">Two</SelectItem>
                      <SelectItem value="6">Three</SelectItem>
                      <SelectItem value="7">Four</SelectItem>
                      <SelectItem value="8">Five</SelectItem>
                      <SelectItem value="9">Six</SelectItem>
                      <SelectItem value="10">Seven</SelectItem>
                      <SelectItem value="11">Eight</SelectItem>
                      <SelectItem value="12">Nine</SelectItem>
                      <SelectItem value="13">Ten</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="academicYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Select Academic Year*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none py-6  placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Academic Year*"
                          className="placeholder:opacity-25"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2018">2018</SelectItem>
                      <SelectItem value="2019">2019</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Select Section*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none py-6 border-x-0 placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Section*"
                          className="placeholder:opacity-25"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="jamuna">Jamuna</SelectItem>
                      <SelectItem value="padma">Padma</SelectItem>
                      <SelectItem value="meghna">Meghna</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button className="rounded-none py-[25px] placeholder:opacity-25" type="submit">
              {isPending ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Error message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {responseError || errorMessage}
        </div>
      )}

      {/* Loading indicator */}
      {isPending && (
        <div className="mt-6 text-center">
          <p>Loading results...</p>
        </div>
      )}

      {/* Results display */}
      {results.length > 0 && (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border ">
          <thead className="text-lg font-normal text-white bg-secondary_school dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                SL
              </th>
              <th scope="col" className="px-6 py-3">
                Photo
              </th>
              <th scope="col" className="px-6 py-3">
                Student ID
              </th>
              <th scope="col" className="px-6 py-3">
                Roll No
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Total Marks
              </th>
              <th scope="col" className="px-6 py-3">
                GPA
              </th>
              <th scope="col" className="px-6 py-3">
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((student, index) => (
              <tr
                key={student.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  <Image
                    className="w-10 h-10 rounded-full object-cover"
                    src="/videos/2.jpg" // Replace with actual photo URL if available
                    alt={student.name}
                    width={50}
                    height={50}
                    priority
                  />
                </td>
                <td className="px-6 py-4">{student.student_id}</td>
                <td className="px-6 py-4">{student.student_roll}</td>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.total_marks}</td>
                <td className="px-6 py-4">{student.gpa}</td>
                <td className="px-6 py-4">{student.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SectionWiseResult;
