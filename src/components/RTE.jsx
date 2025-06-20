import React from "react";
import {Editor} from "@tinymce/tinymce-react";
import {Controller} from "react-hook-form";

export default function RTE({name, control, label, defaultValue = ""}) {
  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        render={({field: {onChange}}) => (
          <Editor
            apiKey="qjn2g3rrd0sfr9eyy2ztlk6o8eshllbmosuglx2smrgfpvqw"
            initialValue={defaultValue}
            init={{
              toolbar_mode: "wrap",
              onboarding: false,
              initialValue: defaultValue,
              height: 500,
              menubar: true,
              plugins: [
                "codesample",
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat |codesample | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
}
