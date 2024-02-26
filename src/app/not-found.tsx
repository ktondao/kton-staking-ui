'use client';

import Error from '@/components/error';

const NotFound = () => {
  return (
    <div className=" flex h-full w-full items-center justify-center">
      <Error
        title="404"
        message="Sorry, Page not found"
        buttonText="Go back"
        action={() => window.history.back()}
      />
    </div>
  );
};

export default NotFound;
