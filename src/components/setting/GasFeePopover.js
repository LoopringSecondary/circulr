import GasFeeForm from './GasFee'
export default const GasFeePopver = (props)=>{
  return (
    <Popover overlayClassName="place-order-form-popover"
      content={<GasFeeForm />}
    >
      {props.children}
    </Popover>
  )
}
