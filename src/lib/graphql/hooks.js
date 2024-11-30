import { useMutation, useQuery } from "@apollo/client";
import {
  companyByIdQuery,
  createJobMutation,
  jobByIdQuery,
  jobsQuery,
} from "./queries";

export const useCompany = (id) => {
  const { loading, data, error } = useQuery(companyByIdQuery, {
    variables: { id },
  });
  return { loading, company: data?.company, error: Boolean(error) };
};

export const useJob = (id) => {
  const { loading, data, error } = useQuery(jobByIdQuery, {
    variables: { id },
  });
  return { loading, job: data?.job, error: Boolean(error) };
};

export const useJobs = (limit, offset) => {
  const { loading, data, error } = useQuery(jobsQuery, {
    variables: { limit, offset },
    fetchPolicy: "network-only",
  });
  return { loading, jobs: data?.jobs, error: Boolean(error) };
};

export const useCreateJob = () => {
  const [mutate, { loading }] = useMutation(createJobMutation);

  const createJob = async (title, description) => {
    const {
      data: { job },
    } = await mutate({
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });
    return job;
  };

  return { createJob, loading };
};
