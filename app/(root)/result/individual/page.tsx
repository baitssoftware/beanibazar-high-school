'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axiosRequest from '@/hooks/axiosRequest';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SubjectResult {
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

interface StudentResultParams {
  student_id: string;
  exam_name: string;
  year: string;
  school_code: number;
}

// Custom hook for fetching student results
const useGetStudentResult = () => {
  return useMutation<SubjectResult[], Error, StudentResultParams>({
    mutationFn: async (params) => {
      const response = await axiosRequest({
        url: `/api/student-result`,
        method: 'GET',
        params: params,
        baseURL: 'https://academichelperbd.com',
      });
      return response.data;
    },
  });
};

// Process the array of subject results to get student info and aggregate data
const processResults = (results: SubjectResult[]) => {
  if (!results || results.length === 0) {
    return null;
  }

  // Get student info from the first result (common across all subjects)
  const firstResult = results[0];

  // Calculate total marks and GPA
  let totalMarks = 0;
  let totalGPA = 0;

  results.forEach((result) => {
    totalMarks += parseInt(result.total_marks) || 0;
    totalGPA += parseFloat(result.gpa) || 0;
  });

  const averageGPA = parseFloat((totalGPA / results.length).toFixed(2));

  // Determine overall grade based on average GPA
  let overallGrade = 'F';
  if (averageGPA >= 5.0) overallGrade = 'A+';
  else if (averageGPA >= 4.0) overallGrade = 'A';
  else if (averageGPA >= 3.5) overallGrade = 'A-';
  else if (averageGPA >= 3.0) overallGrade = 'B';
  else if (averageGPA >= 2.0) overallGrade = 'C';
  else if (averageGPA >= 1.0) overallGrade = 'D';

  return {
    studentInfo: {
      name: firstResult.name,
      student_id: firstResult.student_id,
      roll: firstResult.student_roll,
      class: firstResult.class_name,
      section: firstResult.section,
      group: firstResult.group,
      shift: firstResult.shift,
      exam_name: firstResult.exam_name,
      year: firstResult.year,
    },
    subjects: results.map((result) => ({
      name: result.subject,
      full_marks: result.full_marks,
      obtained_marks: result.total_marks,
      grade: result.grade,
      gpa: result.gpa,
    })),
    summary: {
      total_marks: totalMarks.toString(),
      average_gpa: averageGPA,
      overall_grade: overallGrade,
      total_subjects: results.length,
    },
  };
};

const IndividualResult = () => {
  const [processedResult, setProcessedResult] = useState<any>(null);

  const form = useForm({
    defaultValues: {
      studentId: '',
      examName: '',
      academicYear: '',
    },
  });

  // Use the custom hook
  const { mutate, isPending, error, isError } = useGetStudentResult();

  const onSubmit = (values: any) => {
    // Format the exam name to match API expectations
    const formattedExamName = values.examName
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Call the mutation
    mutate(
      {
        student_id: values.studentId,
        exam_name: formattedExamName,
        year: values.academicYear,
        school_code: 10106,
      },
      {
        onSuccess: (data) => {
          const processed = processResults(data);
          setProcessedResult(processed);
        },
        onError: (err) => {
          console.error('Error fetching results:', err);
        },
      },
    );
  };

  const errorMessage = error instanceof Error ? error.message : 'An error occurred';

  return (
    <div className=" p-4">
      <h2 className="heading">Individual Result</h2>
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-4 items-end py-2 pb-6">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Student ID *</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-none py-6 md:border-e-0 placeholder:opacity-50"
                      placeholder="Student ID *"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="examName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Select Exam Name*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none py-6 placeholder:opacity-50">
                        <SelectValue
                          placeholder="Select Exam Name*"
                          className="placeholder:opacity-50 rounded-none"
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
              name="academicYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Select Academic Year*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none py-6 md:border-x-0 placeholder:opacity-50">
                        <SelectValue
                          placeholder="Select Academic Year*"
                          className="placeholder:opacity-50"
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
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button className="rounded-none py-[25px] w-full" type="submit" disabled={isPending}>
              {isPending ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Error message */}
      {isError && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Loading indicator */}
      {isPending && (
        <div className="mt-6 text-center">
          <p>Loading results...</p>
        </div>
      )}

      {/* Results display */}
      {processedResult && (
        <div className="mt-8 border border-gray-200 rounded-md p-6">
          <h3 className="text-xl font-bold mb-4">Student Result</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{processedResult.studentInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="font-medium">{processedResult.studentInfo.student_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Roll</p>
              <p className="font-medium">{processedResult.studentInfo.roll}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Class</p>
              <p className="font-medium">{processedResult.studentInfo.class}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Section</p>
              <p className="font-medium">{processedResult.studentInfo.section}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Group</p>
              <p className="font-medium">{processedResult.studentInfo.group}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Exam</p>
              <p className="font-medium">{processedResult.studentInfo.exam_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium">{processedResult.studentInfo.year}</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-bold mb-2">Subject Marks</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-2 text-left">Subject</th>
                    <th className="border border-gray-200 p-2 text-left">Full Marks</th>
                    <th className="border border-gray-200 p-2 text-left">Obtained Marks</th>
                    <th className="border border-gray-200 p-2 text-left">Grade</th>
                    <th className="border border-gray-200 p-2 text-left">GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {processedResult.subjects.map((subject: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-gray-200 p-2">{subject.name}</td>
                      <td className="border border-gray-200 p-2">{subject.full_marks}</td>
                      <td className="border border-gray-200 p-2">{subject.obtained_marks}</td>
                      <td className="border border-gray-200 p-2">{subject.grade}</td>
                      <td className="border border-gray-200 p-2">{subject.gpa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Marks</p>
              <p className="font-medium">{processedResult.summary.total_marks}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average GPA</p>
              <p className="font-medium">{processedResult.summary.average_gpa}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Overall Grade</p>
              <p className="font-medium">{processedResult.summary.overall_grade}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Subjects</p>
              <p className="font-medium">{processedResult.summary.total_subjects}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualResult;
