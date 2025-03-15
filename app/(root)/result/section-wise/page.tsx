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
import { useMutation, useQuery } from '@tanstack/react-query';
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

interface SchoolInfo {
  classes: string[];
  sections: string[];
  academic_years: string[];
  exam_names: string[];
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

const useGetSchoolInfo = (school_code: number) => {
  return useQuery<SchoolInfo>({
    queryKey: ['schoolInfo', school_code],
    queryFn: async () => {
      const response = await axiosRequest({
        url: `/api/schoolInfo-for-result`,
        method: 'GET',
        params: { school_code },
        baseURL: 'https://academichelperbd.com',
      });
      return response.data;
    },
  });
};

const SectionWiseResult = () => {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [responseError, setError] = useState<any>('');
  const schoolCode = 10120;
  const {
    data: schoolInfo,
    isLoading: isLoadingSchoolInfo,
    error: schoolInfoError,
  } = useGetSchoolInfo(schoolCode);
  const [selectedExamName, setSelectedExamName] = useState<string>('');

  console.log({ schoolInfo, schoolInfoError });
  const form = useForm();

  const { mutate, isPending, error } = useGetSectionWiseResult();

  const onSubmit = (values: any) => {
    // Use the exam name directly from the form
    const formattedExamName = values.examName;

    mutate(
      {
        exam_name: formattedExamName,
        year: values.academicYear,
        class_name: values.class,
        section: values.section,
        school_code: schoolCode,
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
  const schoolInfoErrorMessage =
    schoolInfoError instanceof Error
      ? schoolInfoError.message
      : 'An error occurred loading school information';

  return (
    <div className="pb-6">
      <h2 className="heading">Section Wise Result</h2>

      {/* Show error if school info fails to load */}
      {schoolInfoError && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {schoolInfoErrorMessage}
        </div>
      )}

      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-5 items-end py-4 pb-6">
            <FormField
              control={form.control}
              name="examName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Select Exam Name*</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Store the display name for the selected exam
                      const displayName = schoolInfo?.exam_names?.find(
                        (exam) => exam.toLowerCase() === value.toLowerCase(),
                      );
                      setSelectedExamName(displayName || value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-none py-6 placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Exam Name*"
                          className="placeholder:opacity-25 rounded-none "
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schoolInfo?.exam_names && schoolInfo.exam_names.length > 0 ? (
                        schoolInfo.exam_names.map((exam) => (
                          <SelectItem key={exam} value={exam.toLowerCase()}>
                            {exam}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-exams">No exam names available</SelectItem>
                      )}
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
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-x-0 py-6 placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Class*"
                          className="placeholder:opacity-25 rounded-none "
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingSchoolInfo ? (
                        <SelectItem value="loading">Loading...</SelectItem>
                      ) : (
                        schoolInfo?.classes.map((className) => (
                          <SelectItem key={className} value={className}>
                            {className}
                          </SelectItem>
                        ))
                      )}
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
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-none py-6  placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Academic Year*"
                          className="placeholder:opacity-25"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingSchoolInfo ? (
                        <SelectItem value="loading">Loading...</SelectItem>
                      ) : (
                        schoolInfo?.academic_years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))
                      )}
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
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-none py-6 border-x-0 placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Section*"
                          className="placeholder:opacity-25"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingSchoolInfo ? (
                        <SelectItem value="loading">Loading...</SelectItem>
                      ) : (
                        schoolInfo?.sections.map((section) => (
                          <SelectItem key={section} value={section.toLowerCase()}>
                            {section}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button
              className="rounded-none py-[25px] placeholder:opacity-25"
              type="submit"
              disabled={isPending || isLoadingSchoolInfo}
            >
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
        <div>
          <h3 className="text-xl font-semibold mb-3">
            {selectedExamName} Results - {form.getValues().class} ({form.getValues().section}) -{' '}
            {form.getValues().academicYear}
          </h3>
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
        </div>
      )}

      {/* No results message */}
      {!isPending && results.length === 0 && form.formState.isSubmitted && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-600">
          No results found. Please try different search criteria.
        </div>
      )}
    </div>
  );
};

export default SectionWiseResult;
