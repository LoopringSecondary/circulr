export default {
  namespace: 'signByMetaMask',
  state: {
    jobs: [],
    completed:false
  },
  reducers: {
    reset(state, {payload}) {
      return {
        jobs:[],
        completed:false
      }
    },
    setJobs(state, {payload}) {
      const {jobs} = payload;
      const unsignedJob = jobs.find(job => !job.signed);
      return {
        jobs,
        completed:!unsignedJob
      }
    },
    updateJob(state,{payload}){
      const {job,index} = payload;
      const {jobs} = state;
      jobs[index] = job;
      const unsignedJob = jobs.find(job => !job.signed);
      return {
        jobs,
        completed:!unsignedJob
      }
    }
  },
}
