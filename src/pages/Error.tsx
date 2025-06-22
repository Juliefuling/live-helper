const Error = (props: { status?: number, msg?: string }) => {
  return (
    <div>
      <div>Error: {props.status}</div>
    </div>
  )
}
export default Error;