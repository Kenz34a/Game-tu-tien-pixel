export default async function Restore({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const {error} = await searchParams;
  return <main className="r-entry" style={{minHeight:'100dvh',display:'grid',placeItems:'center',padding:20,color:'#d9c995'}}>
    <div className="r-panel r-entry-card" style={{width:'min(440px,100%)',padding:28}}>
      <h1 style={{fontSize:26}}>Trở lại tiên lộ</h1>
      <p style={{margin:'16px 0'}}>Nhập mã khôi phục riêng do chủ game cung cấp để tiếp tục nhân vật đã chuyển sang máy chủ này.</p>
      {error&&<p role="alert" style={{color:'#f2a18a'}}>Mã chưa đúng. Hãy kiểm tra lại.</p>}
      <form action="/api/session/restore" method="post" style={{display:'grid',gap:16}}>
        <input name="code" aria-label="Mã khôi phục nhân vật" type="password" required autoComplete="off" placeholder="Mã khôi phục riêng" style={{width:'100%',padding:12,background:'#080d0f',border:'1px solid #6a644d',color:'#eee'}}/>
        <button className="r-btn gold" type="submit">Khôi phục nhân vật</button>
        <a href="/">Bắt đầu nhân vật mới</a>
      </form>
      <p style={{marginTop:16,fontSize:13}}>Giữ mã này riêng tư vì nó cho phép truy cập nhân vật của bạn.</p>
    </div>
  </main>;
}
