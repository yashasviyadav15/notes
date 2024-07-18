import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  workDetails: yup.array().of(
    yup.object().shape({
      companyName: yup.string().required(),
      fromDate: yup.date().required(),
      toDate: yup.date().required(),
      currentlyWorking: yup.boolean()
    })
  ),
  educationDetails: yup.array().of(
    yup.object().shape({
      schoolName: yup.string().required(),
      courseName: yup.string().required(),
      fromDate: yup.date().required(),
      toDate: yup.date().required(),
      currentlyStudying: yup.boolean()
    })
  )
});

const validateNoOverlap = (details) => {
  for (let i = 0; i < details.length; i++) {
    for (let j = i + 1; j < details.length; j++) {
      if (
        (details[i].fromDate <= details[j].toDate && details[i].toDate >= details[j].fromDate)
      ) {
        alert("Date ranges overlap");
        return false;
      }
    }
  }
  return true;
};

const formatDate = (date) => new Date(date).toISOString().split('T')[0];

const ProfileForm = () => {
  const { control, handleSubmit, watch, setValue, setError, clearErrors, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      workDetails: [{ companyName: "", fromDate: "", toDate: "", currentlyWorking: false }],
      educationDetails: [{ schoolName: "", courseName: "", fromDate: "", toDate: "", currentlyStudying: false }]
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

  useEffect(() => {
    const workData = [
      {
        "toDate": "2024-07-15T18:30:00.000Z",
        "fromDate": "2024-07-15T18:30:00.000Z",
        "companyName": "yeah"
      },
      {
        "toDate": "2018-07-15T18:30:00.000Z",
        "fromDate": "2019-07-15T18:30:00.000Z",
        "companyName": "nope"
      }
    ];
    const eduData = [
      {
        "toDate": "2023-02-13T18:30:00.000Z",
        "fromDate": "2023-01-16T18:30:00.000Z",
        "courseName": "sd",
        "schoolName": "yashu"
      },
      {
        "toDate": "2021-02-13T18:30:00.000Z",
        "fromDate": "2022-01-16T18:30:00.000Z",
        "courseName": "lol",
        "schoolName": "mack"
      }
    ];

    reset({
      workDetails: workData.map((work) => ({
        companyName: work.companyName,
        fromDate: formatDate(work.fromDate),
        toDate: formatDate(work.toDate),
        currentlyWorking: false
      })),
      educationDetails: eduData.map((edu) => ({
        schoolName: edu.schoolName,
        courseName: edu.courseName,
        fromDate: formatDate(edu.fromDate),
        toDate: formatDate(edu.toDate),
        currentlyStudying: false
      }))
    });
  }, [reset, setValue]);

  const watchWorkDetails = watch('workDetails');
  const watchEducationDetails = watch('educationDetails');

  useEffect(() => {
    watchWorkDetails?.forEach((work, index) => {
      if (work.currentlyWorking) {
        setValue(`workDetails[${index}].toDate`, new Date().toISOString().split('T')[0]);
      }
    });
  }, [watchWorkDetails, setValue]);

  useEffect(() => {
    watchEducationDetails?.forEach((education, index) => {
      if (education.currentlyStudying) {
        setValue(`educationDetails[${index}].toDate`, new Date().toISOString().split('T')[0]);
      }
    });
  }, [watchEducationDetails, setValue]);

  const onSubmit = (data) => {
    const workDetails = data.workDetails;
    const educationDetails = data.educationDetails;

    const allDetails = [...workDetails, ...educationDetails];

    let valid = true;

    workDetails.forEach((work, index) => {
      if (new Date(work.fromDate) > new Date(work.toDate)) {
        setError(`workDetails.${index}.toDate`, {
          type: "manual",
          message: "To Date should be greater than From Date"
        });
        valid = false;
      }
    });

    educationDetails.forEach((education, index) => {
      if (new Date(education.fromDate) > new Date(education.toDate)) {
        setError(`educationDetails.${index}.toDate`, {
          type: "manual",
          message: "To Date should be greater than From Date"
        });
        valid = false;
      }
    });

    if (!validateNoOverlap(allDetails)) {
      setError("workDetails", { type: "manual", message: "Date ranges overlap" });
      valid = false;
    }

    if (!valid) {
      return;
    }

    // Handle valid data submission
    console.log(data);
  };

  const currentlyWorkingChecked = watchWorkDetails?.some(work => work.currentlyWorking);
  const currentlyStudyingChecked = watchEducationDetails?.some(edu => edu.currentlyStudying);

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
            render={({ field }) => (
              <div>
                <input type="date" {...field} placeholder="To Date" disabled={field.value === new Date().toISOString().split('T')[0]} />
                {errors.workDetails?.[index]?.toDate && (
                  <p>{errors.workDetails[index].toDate.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name={`workDetails[${index}].currentlyWorking`}
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                {...field}
                disabled={currentlyWorkingChecked && !field.value}
              />
            )}
          />
          <label>Currently Working</label>
          <button type="button" onClick={() => removeWork(index)}>Remove</button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendWork({ companyName: "", fromDate: "", toDate: "", currentlyWorking: false })}
        disabled={currentlyWorkingChecked}
      >
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
            render={({ field }) => (
              <div>
                <input type="date" {...field} placeholder="To Date" disabled={field.value === new Date().toISOString().split('T')[0]} />
                {errors.educationDetails?.[index]?.toDate && (
                  <p>{errors.educationDetails[index].toDate.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name={`educationDetails[${index}].currentlyStudying`}
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                {...field}
                disabled={currentlyStudyingChecked && !field.value}
              />
            )}
          />
          <label>Currently Studying</label>
          <button type="button" onClick={() => removeEducation(index)}>Remove</button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendEducation({ schoolName: "", courseName: "", fromDate: "", toDate: "", currentlyStudying: false })}
        disabled={currentlyStudyingChecked}
      >
        Add Education Detail
      </button>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ProfileForm;
