import { AuthProvider } from "../../hooks/AuthProvider";
import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';
import AwaitFailedLayout from "./AwaitFailedLayout";
import React from "react";

export const AuthProviderLayout = () => {
  const outlet = useOutlet();
  const { response } = useLoaderData() as { response: Promise<any>  };

  return (
    <Suspense fallback={
      <ProgressBar animated now={100} />
    }>
      <Await 
        resolve={response}
        errorElement={<AwaitFailedLayout/>}
      >
        {(resolvedUser) => <AuthProvider response = {resolvedUser}>{outlet}</AuthProvider>}
      </Await>
    </Suspense>
  );
};