import React, { FC } from "react";
import LetterPage from "@/components/shared/LetterPage";
import { fetchLettersByLetterId } from "@/lib/actions/letter.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";



const Letter  = async ({ params }: {params: Promise<{ id: string }>}) => {
  const id  = (await params).id;

  const letterData = await fetchLettersByLetterId(id);
  const currentUser = await getCurrentUser();

  const letter = letterData[0];

  return (
    <section className="flex w-full justify-center p-3 sm:mt-0">
      <LetterPage
        letter={letter.letter}
        title={letter.title}
        name={currentUser.name}
      />
    </section>
  );
};

export default Letter;
