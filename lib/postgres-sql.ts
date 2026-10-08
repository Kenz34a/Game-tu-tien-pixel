// Translate only the SQLite constructs used by this game's prepared queries.
export function postgresSql(sql:string){
 sql=sql.replace(/json_array_length\(json_extract\((\w+),'\$\.([\w.]+)'\)\)/gi,(_,column,path)=>`jsonb_array_length(${column}::jsonb #> '{${path.replaceAll('.',',')}}')`)
 .replace(/SELECT COALESCE\(SUM\(value\),0\) FROM json_each\((\w+),'\$\.(\w+)'\)/gi,(_,column,path)=>`SELECT COALESCE(SUM(value::numeric),0) FROM jsonb_each_text(${column}::jsonb -> '${path}')`)
 .replace(/json_extract\((\w+),'\$\.([\w.]+)'\)/gi,(_,column,path)=>`((${column}::jsonb #>> '{${path.replaceAll('.',',')}}')::numeric)`);
 const ignore=/^\s*INSERT OR IGNORE\b/i.test(sql);sql=sql.replace(/^\s*INSERT OR IGNORE\b/i,'INSERT');
 if(ignore)sql=sql.replace(/;?\s*$/,' ON CONFLICT DO NOTHING');
 let result='',parameter=0;
 for(let i=0;i<sql.length;){
  const ch=sql[i];if(ch==="'"||ch==='"'||ch==='`'){const quote=ch,out=quote==='`'?'"':quote;result+=out;i++;while(i<sql.length){if(sql[i]===quote){if(sql[i+1]===quote){result+=out+out;i+=2;continue;}result+=out;i++;break;}result+=sql[i++];}continue;}
  if(ch==='?'){result+='$'+ ++parameter;i++;continue;}
  const fn=/^(MIN|MAX)\s*\(/i.exec(sql.slice(i));if(fn&&(!i||!/[\w]/.test(sql[i-1]))){let depth=1,comma=false,quote='',j=i+fn[0].length;for(;j<sql.length&&depth;j++){const a=sql[j];if(quote){if(a===quote){if(sql[j+1]===quote)j++;else quote='';}continue;}if(a==="'"||a==='"')quote=a;else if(a==='(')depth++;else if(a===')')depth--;else if(a===','&&depth===1)comma=true;}result+=comma?(fn[1].toUpperCase()==='MIN'?'LEAST(':'GREATEST('):fn[0];i+=fn[0].length;continue;}
  result+=ch;i++;
 }
 return result;
}
