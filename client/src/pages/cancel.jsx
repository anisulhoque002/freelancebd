import { useRouter } from "next/router";
import React, { useEffect } from "react";

function Cancel() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push("/"), 5000);
  }, [router]);

  return (
    <div className="h-[80vh] flex items-center px-20 pt-20 flex-col">
      <h1 className="text-4xl text-center text-yellow-500">
        Payment cancelled. You will be redirected to the home page.
      </h1>
      <h1 className="text-4xl text-center">Please do not close the page.</h1>
    </div>
  );
}

export default Cancel; 