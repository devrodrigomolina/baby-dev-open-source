import { useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import kebabCase from "just-kebab-case";

import styles from "./JobPostForm.module.css";

import { ICompany } from "@services/company";
import { IJob } from "@services/job";

import TextInput from "@molecules/formComponents/TextInput";
import TextArea from "@molecules/formComponents/TextArea";
import Select from "@molecules/formComponents/Select";
import UserStackSelector from "@organisms/UserStackSelector";
import PostJobNewData from "@molecules/formComponents/PostJobNewData";

const schema = yup
  .object({
    title: yup.string().required(),
    company: yup.number().required(),
    description: yup.string().required(),
    location: yup.string().required(),
    requisites: yup.array().required(),
    stack: yup.array().required(),
    url: yup.string().required(),
    source: yup.string().required(),
  })
  .required();

interface JobPostFormProps {
  stackAllOptions: { id: number; name: string; stack: string[] }[];
  requisitesOptions: { id: number; value: string }[];
  curatorData: { id: number; name: string };
  refreshStackAllOptions(): void;
  refreshRequisitesOptions(): void;
  refreshCompanyAutoComplete(): void;
  createJob(data: IJob): Promise<string>;
  companiesAllOptions: ICompany[];
}

const JobPostForm = ({
  stackAllOptions,
  curatorData,
  refreshStackAllOptions,
  requisitesOptions,
  refreshRequisitesOptions,
  createJob,
  companiesAllOptions,
  refreshCompanyAutoComplete,
}: JobPostFormProps) => {
  const [formError, setFormError] = useState("");
  const [backendMessage, setBackendMessage] = useState("");

  console.log(companiesAllOptions);
  const companiesToSelect = companiesAllOptions.map((company) => ({
    id: company.id,
    value: company.name,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<Partial<IJob>>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: IJob) => {
    const {
      title,
      company,
      description,
      location,
      requisites,
      stack,
      url,
      source,
    } = data;

    if (stack.length > 5) {
      setFormError("No máximo  5 tecnologias");
      return;
    }

    const indicatedBy = 1; //This come from outside the form - and it is optional
    const now = new Date();

    const blobYear = now.getFullYear();
    const blobMonth = now.toLocaleString("pt-BR", {
      month: "long",
    });
    const blogDay = now.getDay() + 1;
    const blobStack = stack.join("-");

    const blob = kebabCase(
      `${title} ${blobStack} ${company} ${curatorData.name} ${blobYear} ${blobMonth} ${blogDay}`
    );

    const jobPost: IJob = {
      title,
      company,
      description,
      location,
      requisites,
      stack,
      url,
      source,
      status: "open",
      createAt: now,
      modifiedAt: now,
      curator: curatorData.id,
      indicatedBy,
      blob,
    };

    setBackendMessage("Cadastrando...");
    const message = await createJob(jobPost);
    setBackendMessage(message);
    if (message === "Cadastrado com sucesso") {
      setFormError("");
      //reset form fields
    }
  };

  const {
    onChange: onChangeTitle,
    onBlur: onBlurTitle,
    name: nameTitle,
    ref: refTitle,
  } = register("title");

  const {
    onChange: onChangeCompany,
    onBlur: onBlurCompany,
    name: nameCompany,
    ref: refCompany,
  } = register("company");

  const {
    onChange: onChangeDescription,
    onBlur: onBlurDescription,
    name: nameDescription,
    ref: refDescription,
  } = register("description");

  const {
    onChange: onChangeLocation,
    onBlur: onBlurLocation,
    name: nameLocation,
    ref: refLocation,
  } = register("location");

  const {
    onChange: onChangeRequisites,
    onBlur: onBlurRequisites,
    name: nameRequisites,
    ref: refRequisites,
  } = register("requisites");

  const {
    onChange: onChangeUrl,
    onBlur: onBlurUrl,
    name: nameUrl,
    ref: refUrl,
  } = register("url");

  const {
    onChange: onChangeSource,
    onBlur: onBlurSource,
    name: nameSource,
    ref: refSource,
  } = register("source");

  return (
    <div id={styles.root}>
      <p>Cadastrar Vaga</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          onChange={onChangeTitle}
          onBlur={onBlurTitle}
          name={nameTitle}
          ref={refTitle}
          errors={errors}
          placeholder="Título"
        />
        <PostJobNewData
          href="/novaEmpresa"
          notFoundText="Não encontrou a empresa? Cadastre-a aqui"
          updateField={refreshCompanyAutoComplete}
          updateText="Após cadastrar, atualize o auto complete"
        />

        <label>Empresa (temporário, será um input com autocomplete)</label>
        <Select
          onChange={onChangeCompany}
          onBlur={onBlurCompany}
          name={nameCompany}
          ref={refCompany}
          errors={errors}
          options={companiesToSelect}
        />

        <TextArea
          onChange={onChangeDescription}
          onBlur={onBlurDescription}
          name={nameDescription}
          ref={refDescription}
          errors={errors}
          placeholder="Descrição"
          rows={5}
          cols={33}
        />

        <TextInput
          onChange={onChangeLocation}
          onBlur={onBlurLocation}
          name={nameLocation}
          ref={refLocation}
          errors={errors}
          placeholder="Localização"
        />
        <PostJobNewData
          href="/novoRequisito"
          notFoundText="Não encontrou o Requisito? Cadastre um novo"
          updateField={refreshRequisitesOptions}
          updateText="Após cadastrar, atualize o Select"
        />
        <Select
          onChange={onChangeRequisites}
          onBlur={onBlurRequisites}
          name={nameRequisites}
          ref={refRequisites}
          errors={errors}
          options={requisitesOptions}
          multiple
        />

        <PostJobNewData
          href="/novaStack"
          notFoundText="Não encontrou a Tecnologia? Cadastre uma nova"
          updateField={refreshStackAllOptions}
          updateText="Após cadastrar, atualize o Select"
        />

        <UserStackSelector
          allOptions={stackAllOptions}
          initialSelected={[]}
          control={control} //stack form name is inside this component
        />

        <TextInput
          onChange={onChangeUrl}
          onBlur={onBlurUrl}
          name={nameUrl}
          ref={refUrl}
          errors={errors}
          placeholder="Link"
        />

        <TextInput
          onChange={onChangeSource}
          onBlur={onBlurSource}
          name={nameSource}
          ref={refSource}
          errors={errors}
          placeholder="Fonte"
        />

        <button>Submit</button>
        <p>{formError}</p>
        <p>{backendMessage}</p>
      </form>
    </div>
  );
};

export default JobPostForm;
