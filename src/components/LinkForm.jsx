// LinkForm.js
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

const LinkForm = () => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      links: [{ url: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            {...register(`links.${index}.url`)}
            defaultValue={field.url} // make sure to set up defaultValue
            placeholder="Enter link URL"
          />
          {index > 0 && (
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ url: '' })}
      >
        + Add Link
      </button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default LinkForm;
