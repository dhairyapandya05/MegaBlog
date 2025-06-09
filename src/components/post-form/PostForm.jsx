import React, {useCallback} from "react";
import {useForm} from "react-hook-form";
import {Button, Input, RTE, Select} from "../index";
import firebaseService from "../../appwrite/config.js";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import blogFn from "../../blog/blogFunctions.js";

export default function PostForm({post}) {
  console.log("POST: ", post);
  const {register, handleSubmit, watch, setValue, control, getValues} = useForm(
    {
      defaultValues: {
        title: post?.title || "",
        slug: post?.id || "",
        content: post?.content || "",
        status: post?.status || "active",
        estimatedtime: post?.estimatedtime || 0,
      },
    }
  );

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    console.log("[DEBUG - PostForm Submit] Submit function triggered.");
    if (post) {
      console.log("we have a post");
      let fileUrl = post.featuredImage;
      if (data.image && data.image[0]) {
        const file = await firebaseService.uploadFile(data.image[0]);
        if (file) {
          await firebaseService.deleteFile(post.featuredImage);
          fileUrl = file.url;
        }
      }
      const dbPost = await firebaseService.updatePost(post.slug || post.id, {
        ...data,

        featuredImage: fileUrl,
        estimatedtime: blogFn.estimateReadTime(data?.content),
        previewText: blogFn.blogPreview(data.content),
      });
      if (dbPost) {
        console.log(
          "[DEBUG - PostForm Submit] Post updated successfully:",
          dbPost
        );
        navigate(`/post/${dbPost.slug || dbPost.id}`);
      }
    } else {
      console.log("we do not have a post, creating a new one");

      let fileUrl = "";
      if (data.image && data.image[0]) {
        const file = await firebaseService.uploadFile(data.image[0]);
        if (file) fileUrl = file.url;
      }
      console.log("[DEBUG - PostForm Submit] Creating new post with data:", {
        ...data,
        featuredImage: fileUrl,
        userId: userData?.uid || userData?.id,
        slug: data.slug,
      });

      try {
        let obj = {
          ...data,
          author: userData?.name || userData?.displayName || "Anonymous",
          featuredImage: fileUrl,
          userId: userData?.uid || userData?.id,
          estimatedtime: blogFn.estimateReadTime(data?.content),
          previewText: blogFn.blogPreview(data?.content),
          slug: data.slug,
        };
        console.log("GG: ", obj);
        const dbPost = await firebaseService.createPost(obj);
        if (dbPost) {
          console.log(
            "[DEBUG - PostForm Submit] New post created successfully:",
            dbPost
          );
          navigate(`/post/${dbPost.slug || dbPost.id}`);
        } else {
          console.log(
            "[DEBUG - PostForm Submit] createPost returned null or undefined."
          );
        }
      } catch (error) {
        console.error("[ERROR - PostForm Submit] Error creating post:", error);
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, {name}) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {shouldValidate: true});
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  React.useEffect(() => {
    console.log("⭐⭐⭐⭐Post content: ", getValues("content"));
  }, []);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", {required: true})}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", {required: true})}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", {required: !post})}
        />
        {post && post.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={firebaseService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", {required: true})}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
