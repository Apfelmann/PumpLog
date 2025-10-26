import { Button } from "@mui/material";

type Props = {};

export const Dashboard = (props: Props) => {
  const username = "test";
  const workoutTitle = "push?";
  return (
    <div className="flex flex-col  gap-[10px] pl-[20px]">
      <div className=" w-screen pt-[10px] font-bold text-4xl">
        Hey , {username}
      </div>
      <div className="flex flex-row gap-[20px] text-[18px] text-gray-400">
        <div>Heute: {workoutTitle}</div>
        <div>
          {new Date().toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
      <>hiercardindermitte</>
    </div>
  );
};
