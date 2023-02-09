import { AuthProvider } from "../../hooks/AuthProvider";
import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';
export const AuthProviderLayout = () => {
  const outlet = useOutlet();
  const { response } = useLoaderData();

  return (
    <Suspense fallback={
      <ProgressBar animated now={100} />
    }>
      <Await 
        resolve={response}
        fallback={<ProgressBar animated now={100} />}
        errorElement={<div>Error</div>}
      >
        {(resolvedUser) => <AuthProvider response = {resolvedUser}>{outlet}</AuthProvider>}
      </Await>
    </Suspense>
  );
};