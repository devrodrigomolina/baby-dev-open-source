import { useContext } from "react";

import { getAllStackOptions } from "@services/stack";
import { UserContext } from "@contexts/UserContext";
import PostTechStack from "@organisms/forms/PostTechStack";

const PostJobPage = ({ stackAllOptions }) => {
  const { currentUser } = useContext(UserContext);
  const { roles } = currentUser;

  if (!roles.includes("curator")) return <p>Página exclusiva de Curadores</p>;

  return (
    <>
      <PostTechStack stackAllOptions={stackAllOptions} />
    </>
  );
};

export async function getServerSideProps(context) {
  const stackAllOptions = await getAllStackOptions();
  return {
    props: {
      stackAllOptions,
    },
  };
}

export default PostJobPage;
