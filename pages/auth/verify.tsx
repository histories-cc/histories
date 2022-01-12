import Button from '@components/Elements/Buttons/Button';
import { useVerifyTokenMutation } from '@graphql/auth.graphql';
import { useMeQuery } from '@graphql/user.graphql';
import { RedirectInvalidToken } from '@lib/functions/ServerSideProps';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const VerifyPage = () => {
  const router = useRouter();
  const isLogged = useMeQuery();
  const [verifyToken] = useVerifyTokenMutation();
  const [isLoading, setIsLoading] = useState(false);

  if (isLogged.loading) return <div>loading</div>;

  if (router.query.token === undefined) return <div>check your email</div>;
  else
    return (
      <div>
        <Button
          loading={isLoading}
          {...{
            onClick: async () => {
              setIsLoading(true);
              if (router.query.token !== undefined)
                try {
                  await verifyToken({
                    variables: { token: router.query.token.toString() },
                  });
                  toast.success('success');
                  router.replace('/login');
                } catch (error) {
                  // @ts-ignore
                  toast.error(error.message);
                }
              setIsLoading(false);
            },
          }}
        >
          Authorize email
        </Button>
      </div>
    );
};

export const getServerSideProps = RedirectInvalidToken;

export default VerifyPage;
