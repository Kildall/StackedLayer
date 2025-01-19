'use client';

import { LoginForm } from "@/components/forms/LoginForm";
import { FC } from "react";
import { Waves } from "@/components/ui/waves-background";


interface LoginProps {}

export const Login: FC<LoginProps> = () => {
  return (
    <>
      <div className="absolute inset-0">
        <Waves
          lineColor="rgba(0, 0, 0, 0.3)"
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>
      <div className="relative flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm bg-white">
          <LoginForm />
        </div>
      </div>
    </>
  );
};
