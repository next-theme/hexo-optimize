/*!
MIT License

Copyright (c) 2020 Wilson Lin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/wilsonzlin/minify-html/blob/master/nodejs/postinstall.js
*/

use neon::prelude::*;
use neon::types::buffer::TypedArray;

fn minify(mut cx: FunctionContext) -> JsResult<JsBuffer> {
    let src = cx.argument::<JsBuffer>(0)?;
    let opt = cx.argument::<JsObject>(1)?;
    let cfg = minify_html::Cfg {
        do_not_minify_doctype: opt
            .get_opt::<JsBoolean, _, _>(&mut cx, "do_not_minify_doctype")?
            .map(|v| v.value(&mut cx))
            .unwrap_or(false),
        ensure_spec_compliant_unquoted_attribute_values: opt
            .get_opt::<JsBoolean, _, _>(&mut cx, "ensure_spec_compliant_unquoted_attribute_values")?
            .map(|v| v.value(&mut cx))
            .unwrap_or(false),
        keep_closing_tags: opt
            .get_opt::<JsBoolean, _, _>(&mut cx, "keep_closing_tags")?
            .map(|v| v.value(&mut cx))
            .unwrap_or(false),
        keep_html_and_head_opening_tags: opt
            .get_opt::<JsBoolean, _, _>(&mut cx, "keep_html_and_head_opening_tags")?
            .map(|v| v.value(&mut cx))
            .unwrap_or(false),
        keep_spaces_between_attributes: opt
            .get_opt::<JsBoolean, _, _>(&mut cx, "keep_spaces_between_attributes")?
            .map(|v| v.value(&mut cx))
            .unwrap_or(false),
        keep_comments: opt
            .get_opt::<JsBoolean, _, _>(&mut cx, "keep_comments")?
            .map(|v| v.value(&mut cx))
            .unwrap_or(false),
        minify_css: opt
            .get_opt::<JsBoolean, _, _>(&mut cx, "minify_css")?
            .map(|v| v.value(&mut cx))
            .unwrap_or(false),
        minify_js: opt
            .get_opt::<JsBoolean, _, _>(&mut cx, "minify_js")?
            .map(|v| v.value(&mut cx))
            .unwrap_or(false),
        remove_bangs: opt
            .get_opt::<JsBoolean, _, _>(&mut cx, "remove_bangs")?
            .map(|v| v.value(&mut cx))
            .unwrap_or(false),
        remove_processing_instructions: opt
            .get_opt::<JsBoolean, _, _>(&mut cx, "remove_processing_instructions")?
            .map(|v| v.value(&mut cx))
            .unwrap_or(false),
    };
    let out = minify_html::minify(src.as_slice(&mut cx), &cfg);
    Ok(JsBuffer::external(&mut cx, out))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("minify", minify)?;
    Ok(())
}
