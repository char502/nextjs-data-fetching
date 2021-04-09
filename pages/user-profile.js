function UserProfilePage(props) {
  return (
    <h1>{props.username}</h1>
  )
}

export default UserProfilePage;
// can't pre-render as need to know which user rendering for

export async function getServerSideProps(context) {

  const { params, req, res } = context;

  console.log('Server side code');

  return {
    props: {
      username: 'Max'
    }
  };
}

