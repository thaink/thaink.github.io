# Jekyll Module to create tag archive pages
#
# Shigeya Suzuki, November 2013
# Copyright notice (MIT License) attached at the end of this file
#

#
# This code is based on the following works:
#   https://gist.github.com/ilkka/707909
#   https://gist.github.com/ilkka/707020
#   https://gist.github.com/nlindley/6409459
#

#
# Archive will be written as #{archive_path}/#{tag_name}/index.html
# archive_path can be configured in 'path' key in 'tag_archive' of
# site configuration file. 'path' is default null.
#

module Jekyll

  module TagArchiveUtil
    def self.archive_base(site)
      site.config['tag_archive'] && site.config['tag_archive']['path'] || ''
    end
  end

  # Generator class invoked from Jekyll
  class TAgArchiveGenerator < Generator
    def generate(site)
      posts_group_by_tag(site).each do |tag, list|
        site.pages << TagArchivePage.new(site, TagArchiveUtil.archive_base(site), tag, list)
      end
    end

    def posts_group_by_tag(site)
      tag_map = {}
      site.posts.docs.each {|p| p['tags'].each {|c| (tag_map[c] ||= []) << p } }
      tag_map
    end
  end

  # Tag for generating a link to a tag archive page
  class TagArchiveLinkTag < Liquid::Block

    def initialize(tag_name, tag, tokens)
      super
      @tag = tag.split(' ').first || tag
    end

    def render(context)
      # If the tag is a variable in the current context, expand it
      if context.has_key?(@tag)
	      tag = context[@tag]
      else
	      tag = @tag
      end


      if context.registers[:site].config['tag_archive'] && context.registers[:site].config['tag_archive']['slugify']
        tag = Utils.slugify(tag)
      end

      href = File.join('/', context.registers[:site].baseurl, context.environments.first['site']['tag_archive']['path'],
                       tag, 'index.html')
      "<a href=\"#{href}\">#{super}</a>"
    end
  end

  # Actual page instances
  class TagArchivePage < Page
    ATTRIBUTES_FOR_LIQUID = %w[
      tag,
      content
    ]

    def initialize(site, dir, tag, posts)
      @site = site
      @dir = dir
      @tag = tag

      if site.config['tag_archive'] && site.config['tag_archive']['slugify']
        @tag_dir_name = Utils.slugify(@tag).tr(" ", "-") # require sanitize here
      else 
        @tag_dir_name = @tag.tr(" ", "-")
      end

      @layout =  site.config['tag_archive'] && site.config['tag_archive']['layout'] || 'tag_archive'
      self.ext = '.html'
      self.basename = 'index'
      self.content = <<-EOS
{% for post in page.posts %}<li><a href="{{ post.url | prepend: site.baseurl | replace: '//', '/' }}"><span>{{ post.title }}<span></a></li>
{% endfor %}
      EOS
      self.data = {
          'layout' => @layout,
          'type' => 'archive',
          'title' => "Tag archive for #{@tag}",
          'posts' => posts,
          'url' => File.join('/',
                     TagArchiveUtil.archive_base(site),
                     @tag_dir_name, 'index.html')
      }
    end

    def render(layouts, site_payload)
      payload = {
          'page' => self.to_liquid,
          'paginator' => pager.to_liquid
      }.merge(site_payload)
      do_layout(payload, layouts)
    end

    def to_liquid(attr = nil)
      self.data.merge({
                               'content' => self.content,
                               'tag' => @tag
                           })
    end

    def destination(dest)
      File.join('/', dest, @dir, @tag_dir_name, 'index.html')
    end

  end
end

Liquid::Template.register_tag('taglink', Jekyll::TagArchiveLinkTag)

# The MIT License (MIT)
#
# Copyright (c) 2013 Shigeya Suzuki
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
