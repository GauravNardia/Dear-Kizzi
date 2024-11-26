import { LetterForm } from '@/components/forms/letter';
import { getCurrentUser } from '@/lib/actions/user.actions';

const Write: React.FC = async () => {
  const currentUser = await getCurrentUser();
  const accountId = currentUser.accountId;

  return (
    <section>
      <main className="flex flex-col text-left justify-start min-h-screen p-5 mt-[100px] ">
        <div className="w-ful">
          <h1 className="text-4xl font-semibold mt-10 text-left text-gray-800">What happened today?</h1>
          <p className="text-left sm:text-lg text-md text-gray-600 mb-8">If you don't mind, you can share with me. </p>
          <LetterForm accountId={accountId} />
        </div>
      </main>
    </section>
  );
};

export default Write;
