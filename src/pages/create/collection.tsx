import { Button, Input } from '@components/elements';
import { Layout } from '@components/layouts';
import { useCreateCollectionMutation } from '@graphql';
import Router from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type CreateCollectionInput = {
  name: string;
  description?: string;
  isPrivate: boolean;
};

const CreateCollectionPage: React.FC = () => {
  const [createCollection] = useCreateCollectionMutation();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<CreateCollectionInput>();

  const onSubmit: SubmitHandler<CreateCollectionInput> = async (data) => {
    setLoading(true);
    try {
      const result = await createCollection({
        variables: {
          input: data,
        },
      });
      if (result.data?.createCollection !== 'error') {
        Router.push('/collections');
      }
    } catch (error) {
      toast.error(t('error.createCollection'));
    }
    setLoading(false);
  };

  return (
    <Layout
      head={{
        title: `New collection | hiStories`,
        description: `Create new collection on Histories`,
        canonical: 'https://www.histories.cc/create/collection',
        openGraph: {
          title: `New collection | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/create/collection',
          description: `Create new collection on Histories`,
          site_name: 'New collection page',
        },
      }}
    >
      <div className="max-w-lg m-auto">
        craete collection
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label={t('collection_name')}
            register={register}
            name="name"
            options={{ required: true }}
          />
          <Input
            label={t('description')}
            register={register}
            name="description"
            options={{}}
          />
          <Input
            label={t('is_private')}
            register={register}
            name="isPrivate"
            type="checkbox"
            options={{}}
          />

          <Button loading={loading}>Submit</Button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateCollectionPage;
