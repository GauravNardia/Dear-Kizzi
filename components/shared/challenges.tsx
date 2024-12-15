'use client';

import { tasks } from "@/constants";
import ChallengeCard from "../cards/ChallengeCard";





const TaskListPage = () => {
  return (
    <section className="w-full h-screen mt-10 sm:mt-[50px] px-6 md:px-12 lg:px-16">
      {/* Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
          Explore Exciting Challenges
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-2">
          Match and complete tasks in real life!
        </p>
      </div>

      {/* Task Cards Grid */}
      <div className=" w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
        {tasks.map((task) => (
          <ChallengeCard key={task.id} task={task}  />
        ))}
      </div>
    </section>
  );
};

export default TaskListPage;
