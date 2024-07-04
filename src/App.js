import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  workDetails: yup.array().of(
    yup.object().shape({
      companyName: yup.string().required(),
      fromDate: yup.date().required(),
      toDate: yup.date().required()
    })
  ),
  educationDetails: yup.array().of(
    yup.object().shape({
      schoolName: yup.string().required(),
      courseName: yup.string().required(),
      fromDate: yup.date().required(),
      toDate: yup.date().required()
    })
  )
});

const validateNoOverlap = (details) => {
  for (let i = 0; i < details.length; i++) {
    for (let j = i + 1; j < details.length; j++) {
      if (
        (details[i].fromDate <= details[j].toDate && details[i].toDate >= details[j].fromDate)
      ) {
        return false;
      }
    }
  }
  return true;
};

const ProfileForm = () => {
  const { control, handleSubmit, watch, setError, clearErrors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      workDetails: [],
      educationDetails: []
    }
  });

  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
    control,
    name: 'workDetails'
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'educationDetails'
  });

  const onSubmit = (data) => {
    console.log("entered")
    const workDetails = data.workDetails;
    const educationDetails = data.educationDetails;

    const allDetails = [...workDetails, ...educationDetails];

    if (!validateNoOverlap(allDetails)) {
      setError("workDetails", { type: "manual", message: "Date ranges overlap" });
      alert("details should not overlap")
      return;
    }
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Work Details</h2>
      {workFields.map((item, index) => (
        <div key={item.id}>
          <Controller
            name={`workDetails[${index}].companyName`}
            control={control}
            render={({ field }) => <input {...field} placeholder="Company Name" />}
          />
          <Controller
            name={`workDetails[${index}].fromDate`}
            control={control}
            render={({ field }) => <input type="date" {...field} placeholder="From Date" />}
          />
          <Controller
            name={`workDetails[${index}].toDate`}
            control={control}
            render={({ field }) => <input type="date" {...field} placeholder="To Date" />}
          />
          <button type="button" onClick={() => removeWork(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => appendWork({ companyName: "", fromDate: "", toDate: "" })}>
        Add Work Detail
      </button>

      <h2>Education Details</h2>
      {educationFields.map((item, index) => (
        <div key={item.id}>
          <Controller
            name={`educationDetails[${index}].schoolName`}
            control={control}
            render={({ field }) => <input {...field} placeholder="School Name" />}
          />
          <Controller
            name={`educationDetails[${index}].courseName`}
            control={control}
            render={({ field }) => <input {...field} placeholder="Course Name" />}
          />
          <Controller
            name={`educationDetails[${index}].fromDate`}
            control={control}
            render={({ field }) => <input type="date" {...field} placeholder="From Date" />}
          />
          <Controller
            name={`educationDetails[${index}].toDate`}
            control={control}
            render={({ field }) => <input type="date" {...field} placeholder="To Date" />}
          />
          <button type="button" onClick={() => removeEducation(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => appendEducation({ schoolName: "", courseName: "", fromDate: "", toDate: "" })}>
        Add Education Detail
      </button>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ProfileForm;